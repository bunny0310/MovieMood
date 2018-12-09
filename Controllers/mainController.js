const vision = require('@google-cloud/vision');
// Creates a client
const csv=require('csvtojson');
const client = new vision.ImageAnnotatorClient({
  projectId: '318f112092748ffbbbd1d77de5fbfbdbe71447a9',
  keyFilename: '../MovieMood/public/MovieMood-318f11209274.json'
});
// const request = require('request');
const fs = require('fs');
// function pull_imdb()
// {
//   let a="qwerty";
//           request('http://www.omdbapi.com/?apikey=b9eedfe8&t=flames', function(error, response, body) {
//         if (error) { return console.log(error); }
//         body=JSON.parse(body);
//         this.a=body.Title;
//     }); 
//     return a;
// }
exports.index=function(req,res)
{
  // console.log(pull_imdb());
	res.render("index");

}
exports.detectMood=function(req,res)
{
  var img=req.body.data;
  fs.writeFile("../MovieMood/public/out.png", img, 'base64', function(err) {
  console.log(err);
});
function find_max(a,b,c,d)
{
  var x=[];
  var y=[];
  y[0]="joyful";y[1]="angry";y[2]="surpised";y[3]="in sorrow";
  x[0]=a;x[1]=b;x[2]=c;x[3]=d;
  var max=x[0];
  var desc="";
  for(var i=0;i<x.length;++i)
  {
  	if(x[i]>=max){max=x[i];
  	desc=y[i];}
  }
  return desc;
}
//process csv file
async function get_csvfile()
{
const jsonArray=await csv().fromFile("../MovieMood/public/movies.csv");
return jsonArray;
}
// strip off the data: url prefix to get just the base64-encoded bytes
  const request = {image: {content:img}};
  client
    .faceDetection("../MovieMood/public/out.png")
    .then(results => {
    	const faces = results[0].faceAnnotations;
    	var arr=[];
      if(faces.length==0)console.log("ZERO FACES");
    	var face=faces[0];
      console.log(face.joyLikelihood);
    	switch(face.joyLikelihood)
    	{
    		case 'VERY_UNLIKELY':arr["joy"]=0; break;
    		case 'UNLIKELY': arr["joy"]=1; break;
    		case 'POSSIBLE': arr["joy"]=2; break;
    		case 'LIKELY': arr["joy"]=3; break;
    		case 'VERY_LIKELY':arr["joy"]=4; break;
    		default: arr["joy"]=0; break;
    	}
     	switch(face.angerLikelihood)
    	{
    		case 'VERY_UNLIKELY':arr["anger"]=0; break;
    		case 'UNLIKELY': arr["anger"]=1; break;
    		case 'POSSIBLE': arr["anger"]=2; break;
    		case 'LIKELY': arr["anger"]=3; break;
    		case 'VERY_LIKELY':arr["anger"]=4; break;
    		default: arr["anger"]=0; break;
    	}
     	switch(face.sorrowLikelihood)
    	{
    		case 'VERY_UNLIKELY':arr["sorrow"]=0; break;
    		case 'UNLIKELY': arr["sorrow"]=1; break;
    		case 'POSSIBLE': arr["sorrow"]=2; break;
    		case 'LIKELY': arr["sorrow"]=3; break;
    		case 'VERY_LIKELY':arr["sorrow"]=4; break;
    		default: arr["sorrow"]=0; break;
    	}
      	switch(face.surpriseLikelihood)
    	{
    		case 'VERY_UNLIKELY':arr["surprise"]=0; break;
    		case 'UNLIKELY': arr["surprise"]=1; break;
    		case 'POSSIBLE': arr["surprise"]=2; break;
    		case 'LIKELY': arr["surprise"]=3; break;
    		case 'VERY_LIKELY':arr["surprise"]=4; break;
    		default: arr["surprise"]=0; break;
    	}
    	if(arr["joy"]==arr["anger"] && arr["anger"]==arr["sorrow"] && arr["sorrow"]==arr["surprise"])res.send("error1");
    	var max=find_max(arr["joy"],arr["anger"],arr["surprise"],arr["sorrow"]);
      var x=get_csvfile(); 
      var movie_list_comedy=[];   
      var movie_list_drama=[];   
      var movie_list_action=[];   
      var movie_list_animation=[]; 
      var movie_list_romance=[]; 
      var movie_list_fantasy=[]; 
      var r;
      var title;
      // var cats=[];  
      x.then(function(result){
        // for(var i=0;i<result.length;++i)
        // {
        //   if(!(cats.includes(result[i].Genre)))
        //   {
        //     cats.push(result[i].Genre);
        //   }
        // }
        for(var i=0;i<result.length;++i)
        {
          if(result[i].Genre=="Romance" || result[i].Genre=="romance" || result[i].Genre=="Romence")movie_list_romance.push(result[i]);
        }
        for(var i=0;i<result.length;++i)
        {
          if(result[i].Genre=="Action")movie_list_action.push(result[i]);
        }
        for(var i=0;i<result.length;++i)
        {
          if(result[i].Genre=="Fantasy")movie_list_fantasy.push(result[i]);
        }
         for(var i=0;i<result.length;++i)
        {
          if(result[i].Genre=="Animation")movie_list_animation.push(result[i]); 
        }
         for(var i=0;i<result.length;++i)
        {
          if(result[i].Genre=="Comedy" || result[i].Genre=="comedy" || result[i].Genre=="Comdy")movie_list_comedy.push(result[i]); 
        } 
         for(var i=0;i<result.length;++i)
        {
          if(result[i].Genre=="Drama")movie_list_drama.push(result[i]); 
        }     

        if(max=="in sorrow"){
          r = Math.floor((Math.random() * movie_list_comedy.length));
          title=movie_list_comedy[r].Film;}
        else if(max=="joyful"){
          r = Math.floor((Math.random() * movie_list_romance.length));
          title=movie_list_romance[r].Film;}
        else if(max=="angry"){
          r = Math.floor((Math.random() * movie_list_animation.length));
          title=movie_list_animation[r].Film;}
        else if(max=="surprised"){
          r = Math.floor((Math.random() * movie_list_drama.length));
          title=movie_list_drama[r].Film;
        }
        console.log(title);
        res.render("show_info",{title:title,mood:max});
      });
    })
    .catch(err => {
      console.log(err);
      res.send("error");
    });
  }