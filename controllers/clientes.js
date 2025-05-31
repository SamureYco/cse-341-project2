const mongoDb= require("../data/database");
const ObjectId = require("mongodb").ObjectId;


function validateClientData(data) {
    const { name_client, age_client, telef_client, address_client } = data;
    if (
        typeof name_client !== "string" || name_client.trim() === "" ||
        typeof age_client !== "number" || age_client < 0 ||
        typeof telef_client !== "string" || telef_client.trim() === "" ||
        typeof address_client !== "string" || address_client.trim() === ""
    ) {
        return false;
    }
    return true;
}
const getAll = async (req,res) => {
    //#swagger.tags= ["clientes"]
    try{
        const result = await mongoDb.getDatabase().db().collection("clientes").find();
        result.toArray().then((clientes) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(clientes);
    });

    }catch(error){
        res.status(500).json({ error: "Error retrieving clients." });

    }
    

};

const getSingle = async (req,res) => {
        //#swagger.tags= ["clientes"]
    try{
        const userId =new ObjectId(req.params.id);
        const result = await mongoDb.getDatabase().db().collection("clientes").find({_id: userId});
        result.toArray().then((clientes) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(clientes[0]);
    });
    }catch(error){
        res.status(500).json({ error: "Error retrieving the client." });
    }
    
};

const createUser= async (req,res)=>{
        //#swagger.tags= ["clientes"]

    try {
        const user = {
            name_client: req.body.name_client,
            age_client: req.body.age_client,
            telef_client: req.body.telef_client,
            address_client: req.body.address_client
        };

        // Validación de datos
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
        res.status(500).json({ error: "Error creating the client." });
    }
};

const updateUser= async (req,res)=>{
        //#swagger.tags= ["clientes"]

    try {
        const userId = new ObjectId(req.params.id);
        const user = {
            name_client: req.body.name_client,
            age_client: req.body.age_client,
            telef_client: req.body.telef_client,
            address_client: req.body.address_client
        };

        // Validación de datos
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
        res.status(500).json({ error: "Error updating the client." });
    }
};

const deleteUser =async (req,res)=>{
        //#swagger.tags= ["clientes"]

    try {
        const userId = new ObjectId(req.params.id);
        const response = await mongoDb.getDatabase().db().collection("clientes").deleteOne({ _id: userId });
        if (response.deletedCount > 0) {
            res.status(200).json({ message: "Client deleted successfully." });
        } else {
            res.status(500).json({ error: "Failed to delete client." });
        }
    } catch (error) {
        res.status(500).json({ error: "Error deleting the client." });
    }
};
module.exports={
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
};