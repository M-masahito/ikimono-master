// ikimono-master AI Worker (starter)

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {

    if (request.method === "OPTIONS") {
      return new Response(null,{headers:CORS});
    }

    if(request.method==="GET"){
      return new Response(JSON.stringify({
        success:true,
        message:"いきものマスターAIは動作中",
        hasApiKey:!!env.GEMINI_API_KEY
      }),{
        headers:{...CORS,"Content-Type":"application/json"}
      });
    }

    if(!env.GEMINI_API_KEY){
      return new Response(JSON.stringify({
        success:false,
        error:"GEMINI_API_KEY がありません"
      }),{
        status:500,
        headers:{...CORS,"Content-Type":"application/json"}
      });
    }

    const body = await request.json();

    const image=(body.imageBase64||body.image||"").replace(/^data:.*;base64,/,"");

    const prompt=`画像を見て一番可能性が高い生き物を日本語で判定してください。
JSONだけ返してください。
{"name":"","category":"","confidence":0,"description":""}`;

    const r=await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-goog-api-key":env.GEMINI_API_KEY
        },
        body:JSON.stringify({
          contents:[{
            parts:[
              {inline_data:{mime_type:"image/jpeg",data:image}},
              {text:prompt}
            ]
          }]
        })
      }
    );

    return new Response(await r.text(),{
      headers:{...CORS,"Content-Type":"application/json"}
    });
  }
};
