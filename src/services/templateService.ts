import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  where
} from 'firebase/firestore'
import { 
  ref, 
  uploadString, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage'
import { db, storage } from './firebase'
import { BankInfo, TemplateConfig } from '../types'

export interface SavedTemplate {
  id?: string
  bankInfo: BankInfo
  templateConfig: TemplateConfig
  imageUrl?: string
  createdAt?: any
  updatedAt?: any
}

// Collection reference
const COLLECTION_NAME = 'generated_templates'

/**
 * Save generated template to Firestore and Storage
 */
export async function saveTemplate(
  bankInfo: BankInfo,
  templateConfig: TemplateConfig,
  imageDataUrl: string
): Promise<string> {
  try {
    // Upload image to Firebase Storage
    const imageRef = ref(storage, `templates/${Date.now()}_${bankInfo.accountHolder}.png`)
    const uploadResult = await uploadString(imageRef, imageDataUrl, 'data_url')
    const imageUrl = await getDownloadURL(uploadResult.ref)

    // Save template info to Firestore
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      bankInfo,
      templateConfig,
      imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    console.log('Template saved with ID:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('Error saving template:', error)
    throw error
  }
}

/**
 * Get all saved templates
 */
export async function getTemplates(limitCount: number = 20): Promise<SavedTemplate[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    const querySnapshot = await getDocs(q)
    
    const templates: SavedTemplate[] = []
    querySnapshot.forEach((doc) => {
      templates.push({
        id: doc.id,
        ...doc.data()
      } as SavedTemplate)
    })
    
    return templates
  } catch (error) {
    console.error('Error getting templates:', error)
    throw error
  }
}

/**
 * Get templates by account holder name
 */
export async function getTemplatesByAccountHolder(accountHolder: string): Promise<SavedTemplate[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('bankInfo.accountHolder', '==', accountHolder),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    
    const templates: SavedTemplate[] = []
    querySnapshot.forEach((doc) => {
      templates.push({
        id: doc.id,
        ...doc.data()
      } as SavedTemplate)
    })
    
    return templates
  } catch (error) {
    console.error('Error getting templates by account holder:', error)
    throw error
  }
}

/**
 * Delete a saved template
 */
export async function deleteTemplate(templateId: string, imageUrl?: string): Promise<void> {
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, COLLECTION_NAME, templateId))
    
    // Delete image from Storage if URL exists
    if (imageUrl) {
      try {
        // Extract path from URL
        const urlParts = imageUrl.split('/o/')
        if (urlParts.length > 1) {
          const pathPart = urlParts[1].split('?')[0]
          const imagePath = decodeURIComponent(pathPart)
          const imageRef = ref(storage, imagePath)
          await deleteObject(imageRef)
        }
      } catch (storageError) {
        console.warn('Error deleting image from storage:', storageError)
        // Continue even if image deletion fails
      }
    }
    
    console.log('Template deleted successfully')
  } catch (error) {
    console.error('Error deleting template:', error)
    throw error
  }
}

/**
 * Update template information
 */
export async function updateTemplate(
  templateId: string,
  updates: Partial<SavedTemplate>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, templateId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
    
    console.log('Template updated successfully')
  } catch (error) {
    console.error('Error updating template:', error)
    throw error
  }
}