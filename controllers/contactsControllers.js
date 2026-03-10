import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact as updateContactService,
  updateStatusContact,
} from '../services/contactsServices.js';

import HttpError from '../helpers/HttpError.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts(req.user.id);

    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const contact = await getContactById(id, req.user.id);

    if (!contact) {
      throw HttpError(404, 'Not found');
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const deletedContact = await removeContact(id, req.user.id);

    if (!deletedContact) {
      throw HttpError(404, 'Not found');
    }

    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const newContact = await addContact(name, email, phone, req.user.id);

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const updateData = req.body;

    const updatedContact = await updateContactService(
      id,
      updateData,
      req.user.id,
    );

    if (!updatedContact) {
      throw HttpError(404, 'Not found');
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateContactStatus = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const updatedContact = await updateStatusContact(id, req.body, req.user.id);

    if (!updatedContact) {
      throw HttpError(404, 'Not found');
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
