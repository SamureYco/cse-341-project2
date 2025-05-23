const mongoDb= require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req,res) => {
    //#swagger.tags= ["clientes"]
    const result = await mongoDb.getDatabase().db().collection("clientes").find();
    result.toArray().then((clientes) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(clientes);
    });

};

const getSingle = async (req,res) => {
        //#swagger.tags= ["clientes"]

    const userId =new ObjectId(req.params.id);
    const result = await mongoDb.getDatabase().db().collection("clientes").find({_id: userId});
    result.toArray().then((clientes) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(clientes[0]);
    });
};

const createUser= async (req,res)=>{
        //#swagger.tags= ["clientes"]

    const user={
        name_client:req.body.firstName,
        age_client:req.body.lastName,
        telef_client:req.body.email,
        address_client:req.body.favoriteColor
    };
    const response = await mongoDb.getDatabase().db().collection("clientes").insertOne(user);
    if(response.acknowledged){
        res.status(204).send();
    }else{
        res.status(500).json(response.error|| "Some error ocurred while updating the user.");
    }

}

const updateUser= async (req,res)=>{
        //#swagger.tags= ["clientes"]

        const userId =new ObjectId(req.params.id);
        const user={
        name_client:req.body.firstName,
        age_client:req.body.lastName,
        telef_client:req.body.email,
        address_client:req.body.favoriteColor
    };
    const response = await mongoDb.getDatabase().db().collection("clientes").replaceOne({_id: userId},user);
    if(response.modifiedCount>0){
        res.status(204).send();
    }else{
        res.status(500).json(response.error|| "Some error ocurred while updating the user.");
    }

}

const deleteUser =async (req,res)=>{
        //#swagger.tags= ["clientes"]

    const userId =new ObjectId(req.params.id);
    const response = await mongoDb.getDatabase().db().collection("clientes").deleteOne({_id: userId});
    if(response.deletedCount>0){
        res.status(204).send();
    }else{
        res.status(500).json(response.error|| "Some error ocurred while deleting the user.");
    }

}
module.exports={
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
};