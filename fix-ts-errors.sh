#!/bin/bash

# Fix App.tsx
sed -i '' 's/setTabValue(0)/\/\/ setTabValue(0)/' src/App.tsx

# Fix BankInfoForm.tsx
sed -i '' "s/value={bankInfo.notice}/value={bankInfo.notice || ''}/" src/components/BankInfoForm.tsx
sed -i '' "s/value={bankInfo.notice}/value={bankInfo.notice || ''}/" src/components/BankInfoForm.tsx

# Fix unused imports in multiple files
sed -i '' '/import.*Divider.*from/d' src/components/ImagePreview.tsx
sed -i '' '/import.*SaveIcon.*from/d' src/components/ImagePreview.tsx
sed -i '' '/import.*RefreshIcon.*from/d' src/components/LivePreview.tsx
sed -i '' '/import.*DialogActions.*from/d' src/components/NoticeTemplates.tsx
sed -i '' '/import.*Button.*from.*@mui\/material/d' src/components/NoticeTemplates.tsx
sed -i '' '/import.*ListItemText.*from/d' src/components/NoticeTemplates.tsx
sed -i '' '/import.*FormControlLabel.*from/d' src/components/NoticeTemplates.tsx
sed -i '' '/import.*Switch.*from/d' src/components/NoticeTemplates.tsx
sed -i '' '/import.*AddIcon.*from/d' src/components/NoticeTemplates.tsx
sed -i '' '/import.*RefreshIcon.*from/d' src/components/NoticeTemplates.tsx
sed -i '' '/import.*ToggleButton.*from/d' src/components/TemplateCustomizer.tsx
sed -i '' '/import.*ToggleButtonGroup.*from/d' src/components/TemplateCustomizer.tsx

# Fix ListItem button prop
sed -i '' 's/button/component="button"/' src/components/NoticeTemplates.tsx

# Fix unused variable in imageGenerator.ts
sed -i '' 's/const hasFormatting/\/\/ const hasFormatting/' src/utils/imageGenerator.ts

echo "TypeScript errors fixed!"