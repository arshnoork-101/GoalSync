var express=require("express");
var app=express();
// Start the Server 
app.listen(2004, function(){
    console.log("Server Started");
})

app.get("/signup-unsecure", function(req, resp){
    let link1="";
    let link2="";
    if(req.query.radStudent!=null)
        link1=link1+req.query.radStudent+ " , ";
    if(req.query.radGrad!=null)
        link1=link1+req.query.radGrad+ " , ";
    if(req.query.radEmployee!=null)
        link1=link1+req.query.radEmployee+ " , ";
    if(req.query.radStaff!=null)
        link1=link1+req.query.radStaff+ " , ";

    if(req.query.chkInstagram!=null)
        link2=link2+req.query2.chkInstagram+ " , ";
    if(req.query.chkLinkedIn!=null)
        link2=link2+req.query.chkLinkedIn+" , ";
    if(req.query.chkDiscord!=null)
        link2=link2+req.query.chkDiscord;
    
    let data=JSON.stringify(req.query);
    let all="Data: " + "Email ID: "+req.query.txtEmail+" , "+"Password: "+req.query.txtPassword+" , "+" User Type: "+link1+" Linked With uS On: "+link2+"<br>"+data;
    resp.send(all);
    console.log(req.query);
})
app.post("/signup-secure", function(req, resp){
    let link1="";
    let link2="";
    if(req.query.radStudent!=null)
        link1=link1+req.query.radStudent+ " , ";
    if(req.query.radGrad!=null)
        link1=link1+req.query.radGrad+ " , ";
    if(req.query.radEmployee!=null)
        link1=link1+req.query.radEmployee+ " , ";
    if(req.query.radStaff!=null)
        link1=link1+req.query.radStaff+ " , ";

    if(req.query.chkInstagram!=null)
        link2=link2+req.query.chkInstagram+ " , ";
    if(req.query.chkLinkedIn!=null)
        link2=link2+req.query.chkLinkedIn+" , ";
    if(req.query.chkDiscord!=null)
        link2=link2+req.query.chkDiscord;

    let all="Email ID: "+req.query.txtEmail+" , "+"Password: "+req.query.txtPassword+" , "+" User Type: "+link1+" Linked With uS On: "+link2;
    resp.send(all);
    // resp.send(req.body);

})

// Pass the HTML file to be presented client's request
app.get("/", function(req, resp){
    let path=__dirname+"/public/file2.html";
    resp.sendFile(path);
})