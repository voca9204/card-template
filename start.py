#!/usr/bin/env python3
"""
Card Template Project Starter
Port Range: 3130-3139
Default Port: 3130
Project Type: vite-react
"""

import sys
import os
import json
import subprocess
import time
import socket
import signal
import psutil

# 프로젝트 설정
PROJECT_NAME = "card_template"
PORT_RANGE = (3130, 3139)
DEFAULT_PORT = 3130
PROJECT_TYPE = "vite-react"
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))

# 색상 코드
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_info(msg):
    print(f"{Colors.BLUE}ℹ{Colors.ENDC} {msg}")

def print_success(msg):
    print(f"{Colors.GREEN}✓{Colors.ENDC} {msg}")

def print_error(msg):
    print(f"{Colors.RED}✗{Colors.ENDC} {msg}")

def print_warning(msg):
    print(f"{Colors.YELLOW}⚠{Colors.ENDC} {msg}")

def is_port_in_use(port):
    """포트가 사용 중인지 확인"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

def find_available_port():
    """사용 가능한 포트 찾기"""
    for port in range(PORT_RANGE[0], PORT_RANGE[1] + 1):
        if not is_port_in_use(port):
            return port
    return None

def find_process_by_port(port):
    """특정 포트를 사용하는 프로세스 찾기"""
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            for conn in proc.connections():
                if conn.laddr.port == port:
                    return proc
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    return None

def start_project():
    """프로젝트 시작"""
    print_info(f"Starting {PROJECT_NAME}...")
    
    # 포트 확인
    port = find_available_port()
    if port is None:
        print_error(f"No available ports in range {PORT_RANGE[0]}-{PORT_RANGE[1]}")
        return False
    
    if port != DEFAULT_PORT:
        print_warning(f"Default port {DEFAULT_PORT} is in use, using port {port}")
    
    # vite.config.ts 업데이트
    config_path = os.path.join(PROJECT_DIR, 'vite.config.ts')
    if os.path.exists(config_path):
        with open(config_path, 'r') as f:
            content = f.read()
        
        # 포트 번호 업데이트
        import re
        content = re.sub(r'port:\s*\d+', f'port: {port}', content)
        
        with open(config_path, 'w') as f:
            f.write(content)
    
    # npm install 확인
    node_modules = os.path.join(PROJECT_DIR, 'node_modules')
    if not os.path.exists(node_modules):
        print_info("Installing dependencies...")
        subprocess.run(['npm', 'install'], cwd=PROJECT_DIR)
    
    # 프로젝트 시작
    print_success(f"Starting development server on port {port}...")
    print_info(f"URL: {Colors.BOLD}http://localhost:{port}{Colors.ENDC}")
    
    try:
        process = subprocess.Popen(
            ['npm', 'run', 'dev'],
            cwd=PROJECT_DIR,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            bufsize=1
        )
        
        # PID 저장
        pid_file = os.path.join(PROJECT_DIR, '.server.pid')
        with open(pid_file, 'w') as f:
            f.write(str(process.pid))
        
        # 출력 스트리밍
        for line in process.stdout:
            print(line, end='')
        
        process.wait()
        
    except KeyboardInterrupt:
        print_warning("\nShutting down server...")
        stop_project()
    except Exception as e:
        print_error(f"Failed to start server: {e}")
        return False
    
    return True

def stop_project():
    """프로젝트 중지"""
    print_info(f"Stopping {PROJECT_NAME}...")
    
    # PID 파일 확인
    pid_file = os.path.join(PROJECT_DIR, '.server.pid')
    if os.path.exists(pid_file):
        with open(pid_file, 'r') as f:
            pid = int(f.read().strip())
        
        try:
            process = psutil.Process(pid)
            process.terminate()
            process.wait(timeout=5)
            print_success("Server stopped")
        except psutil.NoSuchProcess:
            print_warning("Server process not found")
        except psutil.TimeoutExpired:
            print_warning("Force killing server...")
            process.kill()
        finally:
            os.remove(pid_file)
    
    # 포트로 프로세스 찾기
    for port in range(PORT_RANGE[0], PORT_RANGE[1] + 1):
        proc = find_process_by_port(port)
        if proc:
            print_info(f"Found process on port {port}, stopping...")
            try:
                proc.terminate()
                proc.wait(timeout=5)
            except:
                proc.kill()
    
    print_success(f"{PROJECT_NAME} stopped")
    return True

def status_project():
    """프로젝트 상태 확인"""
    print_info(f"Checking {PROJECT_NAME} status...")
    
    running = False
    for port in range(PORT_RANGE[0], PORT_RANGE[1] + 1):
        if is_port_in_use(port):
            proc = find_process_by_port(port)
            if proc:
                print_success(f"{PROJECT_NAME} is running on port {port}")
                print_info(f"  PID: {proc.pid}")
                print_info(f"  URL: http://localhost:{port}")
                running = True
                break
    
    if not running:
        print_warning(f"{PROJECT_NAME} is not running")
    
    return running

def restart_project():
    """프로젝트 재시작"""
    print_info(f"Restarting {PROJECT_NAME}...")
    stop_project()
    time.sleep(2)
    return start_project()

def main():
    """메인 함수"""
    if len(sys.argv) < 2:
        command = "start"
    else:
        command = sys.argv[1].lower()
    
    commands = {
        "start": start_project,
        "stop": stop_project,
        "restart": restart_project,
        "status": status_project,
    }
    
    if command in commands:
        success = commands[command]()
        sys.exit(0 if success else 1)
    else:
        print_error(f"Unknown command: {command}")
        print_info("Available commands: start, stop, restart, status")
        sys.exit(1)

if __name__ == "__main__":
    # 프로젝트 디렉토리로 이동
    os.chdir(PROJECT_DIR)
    main()