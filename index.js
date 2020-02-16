
"use strict";
var express = require('express');
var app = express();
var a = new Array();
var login = require("./Schema/login");
var register = require("./Schema/registration");
var contact = require("./Schema/contactus");
var faculty = require("./Schema/facultyInfo");
var facultyUpload = require("./Schema/facultyUploads");
var sample=require("./Schema/sampletbl");
var reg_id = null;
var gallary=require("./Schema/gall");

var array=new Array();
var array1=[];
var mongoose = require('mongoose');

var port = process.env.PORT || 8080;

//MongoDb commands
//To connect with Database
mongoose.connect('mongodb://www.androidsutra.in/collegedb', {});
//mongoose.connect('mongodb://localhost:27017/collegedb', {});

//check the connection is occure or not if not it exist with 1
mongoose.connection.on('error', function (error) {
    console.log("An Error Occure while making Database connection", error);
    process.exit(1);
}).once('open', function (args) {
    console.log("Mongoose connection established succesfully");
})


app.use(express.json());

app.post("/sampleInsert",function(request,response){
    var body=request.body;

    var sampletbl=new sample(body);
  
    sampletbl.save().then(Item =>
        response.json(Item)
    )
        .catch(error =>
            response.json((error))
        )

});

//Post data in  registration and login tables

app.get("/getImg",function(req,res)
{
    gallary.find({img_type:req.query.type},function(err,data)
    {
        if(data)
        {
            res.json(data)
        }
        else
        {
            res.json("data not found");
        }
    })
})

app.post("/insImg",function(req,res)
{
    gallary.insertMany(req.body,function(err,data)
    {
        if(err)
        {
            res.json("error in api side")
        }
        else
        {
            if(data)
            {
                res.json(data);
            }
            else
            {
                res.json("failed")
            }
        }
    })
})
app.post("/register", async function (request, response) {

    register.insertMany(request.body, function (err, data) {
        if (err) {
            response.json({success:0})
        }
        else {
            if (data) {

                login.insertMany({ "email": request.body.email, "password": request.body.password }, function (err, data) {
                    if (err) {
                        response.json({success:0})

                    }
                    else {
                        if (data) {
                            response.json({success:1})
                        }
                    }
                })
            }
        }

    });



});


app.post("/contactus", async function (request, response) {

    contact.insertMany({ "email": request.body.email, "address": request.body.address , "mobileno": request.body.mobileno}, function (err, data) {
        if (err) {
            response.json({success:0})
        }
        else {
            if (data) {
                response.json({success:1})
            }
        }
    
    });

    });


    app.get("/getContactus",function(req,res)
    {
        contact.find(req.body,function(err,data)
        {
            if(data)
            {
                res.json(data)
            }
            else
            {
                res.json({success:0});
            }
        });
    });


//find the user from login if exists
app.get('/getStudents',function(req,res)
{
    register.find({"email":req.query.email},function(err,data)
    {
        if(data)
        {
            var dept=data[0].department;
            console.log(dept);
            
            register.find({"department":dept,"role":"student"},function(err,data)
            {
                res.json(data);
            })
        }
    })


})
app.post('/login', function (request, response) {

    var body = request.body;

    register.findOne({ "email": body.email, "password": body.password }, function (error, data) {
        if (error)
            return response.json(error);
        else {
            if (data) {

                // register.find({"email":body.email,"password"})
                return response.json(data);
            }
            else {
                
                return response.json({email:"null",password:"null",status:true,_id: "null",fname: "null", lname: "null",mname: "null",email: "null",password: "null",role: "null",department: "null",createdAt: "null",updatedAt: "null",__v: 0,profile: "null",enrollNo: "null"});

            }

        }


    })



});
app.get('/getFacDept',function(req,res)
{
    register.find({"department":req.query.department},function(err,data)
    {
        if(err)
        {
            res.json("error at api side")
        }
        else
        {
            if(data)
            {
                res.json(data)
            }
            else
            {
                res.json("data not found");
            }
        }
    })
})

app.get('/getUsers',function(request,response){
    var role=request.query.role;

    register.find({"role":role},function(error,data){
        if(error){
            return  response.json(error);
        }
        return response.json(data);
    
    })
})

//get the Details of Faculty Department Wise 
app.get('/getFacultyInfo',function(request,response){
    var body = request.body;
    register.find({"department":body.department,"role":"faculty"},async function(err,data)
    {
        if(err)
        {
            response.json("error at api side")
        }
        else
        {
            var datalength=data.length;
            console.log("length"+datalength);
            // console.log(data[0]._id);
            if(data)
            {
                let arr = data.map(ele => new mongoose.Types.ObjectId(ele.id));
                console.log(arr);

var results=await faculty.find({})
.where('reg_id')
.in(arr)
.exec(function(error1,dataa){
    if(error1){
        response.json({success:0});
    }
    else{
    console.log(dataa);
    response.json(dataa);
    }
});
// console.log(faculty.find({})
// .where('reg_id')
// .in(arr)
// .exec(function(error,dataa){

// }));

            //    for(var i=0;i<datalength;i++){
            //     faculty.find({"reg_id":arr[i]._id},function(error,datas){
            //         if(error){
            //             response.json({success:0});
            //         }else{
                      
            //             array.push(datas)
            //             // array1[i]=datas;
            //             // console.log(datas);
            //             // response.json(datas);
            //         }
            //         response.json(datas);
            //     })
                // response.json(array);
            // }
      //      console.log(datas);

           
    //   response.json(array);
      console.log(array);      
                // var dept=data;
                // console.log(dept);
                // response.json(data)
            }
            else
            {
                response.json("data not found");
            }
        }
    })
    
})


//store the faculty information in faculty table 
app.post('/facultyInfo', function (request, response) {
    var body = request.body;


    register.findOne({ "email": request.body.emailid, "password": request.body.password }, function (error, data) {
        if (error)
            response.json(error)
        else
      //  console.log(data);
            if (data.role == "faculty")
                reg_id = data._id;
        if (reg_id != null) {
            request.body.reg_id = reg_id;
            // console.log("reg_id=" + reg_id);
            var faculty1 = new faculty(body);
            faculty1.save().then(Item =>
                response.send(Item)
            )
                .catch(error =>

                    response.json(error)
                )
        }
        else {
            response.json("error in code");
        }
        // response.json(data);

    })


})

//store the faculty uploads in  facultyUploads table


app.get("/getSpecificAss",function(request,response)
{

    var body = request.body;
    register.find({ "email": request.query.email  }, function (error, data) {
        if (error) {
            response.json("error foun on api side" + error);
        }
        else {
            if (data) {
                var dept = data[0].department;
                  facultyUpload.aggregate([{$lookup:{
                    from: 'registration',
                    localField: 'reg_id',
                    foreignField: '_id',
                    as: 'string'
                  }},{$match: {"string.department":dept,"type":request.query.type,"forStud":request.query.email}},
                ],function(err,dat)
                 {
                    if(dat)
                    {
                                     
                        response.json(dat);
                    }
                    else
                    {
                        response.json("data not found");
                    }
                })
            }
            else {
                response.json("data not found");
            }
        }

    })

})

app.get("/getAssignment", function (request, response) {

    var body = request.body;
    register.find({ "email": request.query.email}, function (error, data) {
        if (error) {
            response.json("error foun on api side" + error);
        }
        else {
            if (data) {
                var dept = data[0].department;
              
          
                facultyUpload.aggregate([{$lookup:{
                    from: 'registration',
                    localField: 'reg_id',
                    foreignField: '_id',
                    as: 'string'
                  }},{$match: {"string.department":dept,"type":request.query.type,"forStud":""}},
                ],function(err,dat)
                 {
                    if(dat)
                    {
                                      
                        response.json(dat);
                    }
                    else
                    {
                        response.json("data not found");
                    }
                })
            }
            else {
                response.json("data not found");
            }
        }

    })
})


app.post("/updateUser", function (request, response) {

    register.findOneAndUpdate({ "email": request.body.email }, request.body, function (error, data) {
        if (error) {
            response.json("error foun on api side" + error);
        }
        else {
            if (data) {
                response.json(data)
            }
            else {
                response.json("data not found");
            }
        }
    })
});

app.post("/getUserById", function (request, response) {
    register.findOne({ "email": request.body.email }, function (error, data) {
        if (error) {
            response.json("error found on api side" + error);
        }
        else {
            if (data) {
                response.json(data);
            }
            else {
                response.json("data not found");
            }
        }

    })
})
app.post("/facultyUploads", function (request, response) {
    var body = request.body;

    // if(request.query==undefined){
    //     return response.json("please give registration detail as email and password")
    // }

    register.findOne({ "email": request.query.email}, function (error, data) {
        if (error)
            response.json(error)
        else {
            console.log(data.role);
            if (data.role == "faculty") {
                // console.log(""+data.role);
                response.send(data);
                reg_id = data._id;
                // if(reg_id!=null){
                request.body.reg_id = reg_id;
                console.log("reg_id=" + reg_id);
                var facultyUpload1 = new facultyUpload(body);
                facultyUpload1.save().then(Item =>
                    response.send(Item)
                )
                    .catch(error =>

                        response.json(error)
                    )
            }
            else {
                response.json("You are not faculty");
            }
            // }
        }        // response.json(data);

    })
})


app.get('/me', function (req, res) {
    var q = req.query;

    res.json({ "name": q.name });

});
app.get('/hello', (req, res) => {
    return res.json('hello');
})

//Post
// app.post('/post',function (request, response) {
//     var body =request.body;
//     var Movie1 = new Movie(request.body);
//     Movie1.save().then(Item =>
//         response.send(Item)
//     )
//         .catch(error =>
//             response.send((error))
//         )


// })

//put for update
// app.put('/update',function(request,response){
//     var email=request.query.email;
//     Movie.findOneAndUpdate(email,request.body,function(error,data){
//         if(error)
//         return response.send("Error occour")
//         else
//         return response.json(request.body);
//     });
// })


//delete
// app.delete('/delete',function(request,response){
//     var email=request.query.email;
//     Movie.findOneAndDelete(email,function(error,data){
//         if(error)
//         {
//             return response.send("error")
//         }
//         return response.json(data);
//     })
// })


//get all data
// app.get('/getdata',function(request,response){

//     Movie.find(function(error,data){
//         if(error)
//             return response.send("Error")
//         return response.json(data);
//     });


// });

app.get("/myname", function (request, response) {
    // Movie.findOne({"email":request.query.email},function(error,data){
    //     if(error)
    //         return response.send("Error");

    //     return response.json(data);
    // })
    return response.json("name " + request.query.name);
})

app.listen(9001, function (error) {
    if (error)
        console.log("an error occure while starting node application", error);
    console.log("node appliction has beeen sucessfully started ");
});
