// src/services/contacts.js

import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  type,
  isFavourite,
  userId,
}) => {
  const query = { userId };
  if (type) query.contactType = type;
  if (isFavourite !== undefined) query.isFavourite = isFavourite;

  const contacts = await ContactsCollection.find(query)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip((page - 1) * perPage)
    .limit(perPage);

  const totalItems = await ContactsCollection.countDocuments(query);

  return { contacts, totalItems };
};

export const getContactById = async (contactId, userId) => {
  return await ContactsCollection.findOne({ _id: contactId, userId });
};

export const addContact = async (contactData) => {
  return await ContactsCollection.create(contactData);
};

export const patchContact = async (contactId, contactData, userId) => {
  return await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    contactData,
    { new: true },
  );
};

export const removeContact = async (contactId, userId) => {
  return await ContactsCollection.findOneAndDelete({ _id: contactId, userId });
};