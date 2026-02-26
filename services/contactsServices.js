import Contact from '../models/contact.js';

export async function listContacts() {
  try {
    const contacts = await Contact.findAll();
    return contacts;
  } catch (error) {
    console.log(error);
  }
}

export async function getContactById(contactId) {
  try {
    const contact = await Contact.findByPk(contactId);
    return contact;
  } catch (error) {
    console.log(error);
  }
}

export async function removeContact(contactId) {
  try {
    const contact = await Contact.findByPk(contactId);
    if (!contact) return null;
    await contact.destroy();
    return contact;
  } catch (error) {
    console.log(error);
  }
}

export async function addContact(name, email, phone) {
  try {
    const newContact = await Contact.create({ name, email, phone });
    return newContact;
  } catch (error) {
    console.log(error);
  }
}

export async function updateContact(contactId, data) {
  try {
    const contact = await Contact.findByPk(contactId);
    if (!contact) return null;
    const updated = await contact.update(data);
    return updated;
  } catch (error) {
    console.log(error);
  }
}

export async function updateStatusContact(contactId, body) {
  try {
    const contact = await Contact.findByPk(contactId);
    if (!contact) return null;
    const updated = await contact.update({ favorite: body.favorite });
    return updated;
  } catch (error) {
    console.log(error);
  }
}
