import Contact from "../models/contacts.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { SORT_ORDER } from "../constants/index.js";
export const fetchAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id'
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const contactsQuery = Contact.find();
  const contactsCount = await Contact.find()
    .merge(contactsQuery)
    .countDocuments();
  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);
  return {
    data: contacts,
    ...paginationData
  };
};

export const fetchContactById = async (contactId) => {
    const contact = await Contact.findById(contactId);
    return contact;
};

export const createContact = async (contactData) => {
    try {
        const newContact = new Contact(contactData);
        await newContact.save();
        return newContact;
    } catch (error) {
        console.error('Error while creating a new contact:', error);
    }
};

export const updateContact = async (contactId, contactData) => {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(contactId, contactData, { new: true });
        return updatedContact;
    } catch (error) {
        console.error(`Error while updating contact with id ${contactId}:`, error);
    }
};

export const deleteContact = async (contactId) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(contactId);
        return deletedContact;
    } catch (error) {
        console.error(`Error while deleting contact with id ${contactId}:`, error);
    }
};
