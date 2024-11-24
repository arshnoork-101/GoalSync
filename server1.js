var express=require("express");
var app=express();
//===========SQL CONNECTION FOR DATABASE================
// Step 1
var mysql2=require("mysql2");
// Step 2
let config="mysql://avnadmin:AVNS_tpOP0jbL8CSXgcAcREm@mysql-50284af-arshnoor64050-06f9.l.aivencloud.com:25622/defaultdb";
// Step 3
var mysqlServer=mysql2.createConnection(config);
// Step 4
mysqlServer.connect(function(err)
{
    if(err==null)
        console.log("Connected to aiven Database Server Successfully");
    else
    console.log(err.message);
})
//=============CLOUDINARY CONNECTION===============
// Step 1
// npm install cloudinary
// Step 2
var cloudinary=require("cloudinary").v2;
// Step 3
cloudinary.config({ 
    cloud_name: 'da9gwrtit', 
    api_key: '416944178917971', 
    api_secret: 's0ilyVaoJzh4vSoyPpwfO-yJMyw' // Click 'View API Keys' above to copy your API secret
});
// Step 4: Changes in the picture if-else section with async-await option
aapp.post("/signup-process-secure",async function(req,resp)
{
    //console.log(req.files.profilepic.name);
    let filename="";
    if(req.files==null)//pic did't uploaded
        {
            filename="nopic.jpg";
        }
        else
        {
            filename=req.files.profilepic.name;
            let path=__dirname+"/public/uploads/"+filename;
            console.log(path);
            req.files.profilepic.mv(path);

            //saving ur file/pic on cloudinary server
           await cloudinary.uploader.upload(path).then(function(result){
                 filename=result.url;   //will give u the url of ur pic on cloudinary server
                 console.log(filename);
           });
        }
    req.body.picpath=filename;//new name-value pair added in body object

    //save data acc to columns sequence
    mysqlServer.query("insert into users values(?,?,?,?,?)",[req.body.txtMail,req.body.txtPassword,req.body.utype,req.body.dob,req.body.picpath],function(err)
    {
        if(err==null)
               resp.send("Record Saved Successfully");
        else
                resp.send(err.message); 

    })
    // resp.send(req.body);
    //resp.send("U are Signedup with Id="+req.body.txtMail);
})

app.listen(2002, function(){
    console.log("Server Started");
})

app.get("/hello", function (req, resp){ 
    // Hello ke corresponding server kya function kre
    // Request(Request by client) and response(Response to the client) are receiver objects(Formal Arguments) 
        resp.contentType("text/html"); // The response should be sent to browser should be treated as HTML file
        resp.write("Hello OH MY dear programmers");
        resp.end(); //Over
})
app.get("/signup",function(req,resp){
    resp.contentType("text/html");
    resp.write("<center><b>Your Form has been submitted...</b>");
    resp.write("<br><i>Congratulations...</i></center>");
    resp.end();
})
app.get("/login", function(req, resp){
    resp.contentType("text/html");
    resp.write("<center>You can Log In without any risks...</b>");
    resp.write("<br><i><b>Enjoy...</b></i></center>");
    resp.end();
})
app.get("/info", function(req, resp){
    //Global Variables
    // The answers to these questions will be shown in the terminal after you load the port on server
    console.log(__filename); // File you are currently working with
    console.log(__dirname);  // Directory you are in currently
})

app.get("/", function(req, resp){
    let path=__dirname+"/public/file1.html";
    resp.sendFile(path);
})