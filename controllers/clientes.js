const mongoDb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

function validateClientData(data) {
  const { name_client, age_client, telef_client, address_client } = data;

  if (
    typeof name_client !== "string" || name_client.trim() === "" ||
    typeof telef_client !== "string" || telef_client.trim() === "" ||
    typeof address_client !== "string" || address_client.trim() === ""
  ) {
    return false;
  }

  const age = Number(age_client);
  if (isNaN(age) || age < 0) {
    return false;
  }

  return true;
}

const getAll = async (req, res) => {
  try {
    const clientes = await mongoDb.getDatabase().db().collection("clientes").find().toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(clientes);
  } catch (error) {
    console.error("Error retrieving clients:", error);
    res.status(500).json({ error: "Error retrieving clients." });
  }
};

const getSingle = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const cliente = await mongoDb.getDatabase().db().collection("clientes").findOne({ _id: userId });
    if (!cliente) {
      return res.status(404).json({ error: "Client not found." });
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(cliente);
  } catch (error) {
    console.error("Error retrieving the client:", error);
    res.status(500).json({ error: "Error retrieving the client." });
  }
};

const createUser = async (req, res) => {
  try {
    const user = {
      name_client: req.body.name_client,
      age_client: Number(req.body.age_client),
      telef_client: req.body.telef_client,
      address_client: req.body.address_client
    };

    if (!validateClientData(user)) {
      return res.status(400).json({ error: "Invalid client data." });
    }

    const response = await mongoDb.getDatabase().db().collection("clientes").insertOne(user);
    if (response.acknowledged) {
      res.status(201).json({ message: "Client created successfully." });
    } else {
      res.status(500).json({ error: "Failed to create client." });
    }
  } catch (error) {
    console.error("Error creating the client:", error);
    res.status(500).json({ error: "Error creating the client." });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const user = {
      name_client: req.body.name_client,
      age_client: Number(req.body.age_client),
      telef_client: req.body.telef_client,
      address_client: req.body.address_client
    };

    if (!validateClientData(user)) {
      return res.status(400).json({ error: "Invalid client data." });
    }

    const response = await mongoDb.getDatabase().db().collection("clientes").replaceOne({ _id: userId }, user);
    if (response.modifiedCount > 0) {
      res.status(200).json({ message: "Client updated successfully." });
    } else {
      res.status(500).json({ error: "Failed to update client." });
    }
  } catch (error) {
    console.error("Error updating the client:", error);
    res.status(500).json({ error: "Error updating the client." });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongoDb.getDatabase().db().collection("clientes").deleteOne({ _id: userId });
    if (response.deletedCount > 0) {
      res.status(200).json({ message: "Client deleted successfully." });
    } else {
      res.status(500).json({ error: "Failed to delete client." });
    }
  } catch (error) {
    console.error("Error deleting the client:", error);
    res.status(500).json({ error: "Error deleting the client." });
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser
};
