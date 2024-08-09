import express from 'express';
import {
  getContacts,
  getContactById,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contactsController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId',
  isValidId,
  ctrlWrapper(getContactById));
router.post('/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController));
router.patch('/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController));
router.delete('/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController));

export default router;

