import Contact from '../models/contact.js';

export async function listContacts(ownerId) {
  const contacts = await Contact.findAll({
    where: { owner: ownerId },
  });

  return contacts;
}

export async function getContactById(contactId, ownerId) {
  const contact = await Contact.findOne({
    where: {
      id: contactId,
      owner: ownerId,
    },
  });

  return contact;
}

export async function removeContact(contactId, ownerId) {
  const contact = await Contact.findOne({
    where: {
      id: contactId,
      owner: ownerId,
    },
  });

  if (!contact) return null;

  await contact.destroy();

  return contact;
}

export async function addContact(name, email, phone, ownerId) {
  const newContact = await Contact.create({
    name,
    email,
    phone,
    owner: ownerId,
  });

  return newContact;
}

export async function updateContact(contactId, data, ownerId) {
  const contact = await Contact.findOne({
    where: {
      id: contactId,
      owner: ownerId,
    },
  });

  if (!contact) return null;

  const updated = await contact.update(data);

  return updated;
}

export async function updateStatusContact(contactId, body, ownerId) {
  const contact = await Contact.findOne({
    where: {
      id: contactId,
      owner: ownerId,
    },
  });

  if (!contact) return null;

  const updated = await contact.update({
    favorite: body.favorite,
  });

  return updated;
}
