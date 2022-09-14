//basic cApp framework, you can use it easily.
//you can load lib on cApp protocol keyword "lib"
(function(agent,con,error){
    if(error!=null) console.log(error);
    if(!con) console.log('No container to run cApp.');
    if(!agent) console.log('No way to interact with anchor network.');
    //console.log("Hello world");

})(agent,con,error);