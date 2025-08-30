import { 
  doc, 
  getDoc, 
  setDoc,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore'
import { db } from './firebase'
import { defaultBanks, addBankIfNotExists } from '../data/bankList'

const COLLECTION_NAME = 'settings'
const BANKS_DOC = 'banks'

export interface BankData {
  customBanks: string[]
  lastUpdated: Date
}

// Get global bank list (default + custom)
export const getGlobalBanks = async (): Promise<string[]> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, BANKS_DOC)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data() as BankData
      // Merge default banks with custom banks
      const customBanks = data.customBanks || []
      const mergedBanks = [...defaultBanks]
      
      // Add custom banks that aren't in default list
      for (const bank of customBanks) {
        if (!mergedBanks.includes(bank)) {
          const otherIndex = mergedBanks.indexOf('其他')
          if (otherIndex > -1) {
            mergedBanks.splice(otherIndex, 0, bank)
          } else {
            mergedBanks.push(bank)
          }
        }
      }
      
      return mergedBanks
    } else {
      // Initialize with default banks
      await initializeBanks()
      return defaultBanks
    }
  } catch (error) {
    console.error('Error getting banks from Firebase:', error)
    // Fallback to localStorage if Firebase fails
    const savedBanks = localStorage.getItem('customBanks')
    return savedBanks ? JSON.parse(savedBanks) : defaultBanks
  }
}

// Initialize banks document
const initializeBanks = async (): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, BANKS_DOC)
    await setDoc(docRef, {
      customBanks: [],
      lastUpdated: new Date()
    })
  } catch (error) {
    console.error('Error initializing banks:', error)
  }
}

// Add a new bank to global list
export const addBankToGlobalList = async (bankName: string): Promise<string[]> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, BANKS_DOC)
    const docSnap = await getDoc(docRef)
    
    let customBanks: string[] = []
    if (docSnap.exists()) {
      const data = docSnap.data() as BankData
      customBanks = data.customBanks || []
    }
    
    // Check if bank already exists in custom list
    if (!customBanks.includes(bankName) && !defaultBanks.includes(bankName)) {
      customBanks.push(bankName)
      await setDoc(docRef, {
        customBanks,
        lastUpdated: new Date()
      }, { merge: true })
      console.log('Added new bank to Firebase:', bankName)
    }
    
    // Return merged list
    return await getGlobalBanks()
  } catch (error) {
    console.error('Error adding bank:', error)
    // Fallback to localStorage
    const savedBanks = localStorage.getItem('customBanks')
    const currentBanks = savedBanks ? JSON.parse(savedBanks) : defaultBanks
    const updatedBanks = addBankIfNotExists(bankName, currentBanks)
    localStorage.setItem('customBanks', JSON.stringify(updatedBanks))
    return updatedBanks
  }
}

// Save entire bank list (for settings management)
export const saveGlobalBanks = async (banks: string[]): Promise<void> => {
  try {
    // Extract custom banks (not in default list)
    const customBanks = banks.filter(bank => !defaultBanks.includes(bank))
    
    const docRef = doc(db, COLLECTION_NAME, BANKS_DOC)
    await setDoc(docRef, {
      customBanks,
      lastUpdated: new Date()
    }, { merge: true })
    
    // Also save to localStorage as backup
    localStorage.setItem('customBanks', JSON.stringify(banks))
    console.log('Saved banks to Firebase')
  } catch (error) {
    console.error('Error saving banks:', error)
    // Fallback to localStorage only
    localStorage.setItem('customBanks', JSON.stringify(banks))
  }
}

// Real-time listener for bank list changes
export const subscribeToBanks = (
  callback: (banks: string[]) => void
): Unsubscribe => {
  const docRef = doc(db, COLLECTION_NAME, BANKS_DOC)
  
  return onSnapshot(docRef, async (doc) => {
    const banks = await getGlobalBanks()
    callback(banks)
  }, (error) => {
    console.error('Error in bank subscription:', error)
    // Fallback to localStorage
    const savedBanks = localStorage.getItem('customBanks')
    callback(savedBanks ? JSON.parse(savedBanks) : defaultBanks)
  })
}

// Migrate localStorage banks to Firebase (one-time migration)
export const migrateLocalStorageToFirebase = async (): Promise<void> => {
  try {
    const localBanks = localStorage.getItem('customBanks')
    if (localBanks) {
      const banks = JSON.parse(localBanks) as string[]
      
      // Add each custom bank to Firebase
      for (const bank of banks) {
        if (!defaultBanks.includes(bank)) {
          await addBankToGlobalList(bank)
        }
      }
      
      console.log('Migrated localStorage banks to Firebase')
      // Keep localStorage as backup, don't clear it
    }
  } catch (error) {
    console.error('Error migrating banks:', error)
  }
}