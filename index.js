const core = require('@actions/core');
const github = require('@actions/github');
const process = require('child_process');
const fs = require('fs');
const axios = require('axios');

try {
  // `who-to-greet` input defined in action metadata file
  const use_strict = core.getInput('use_strict');

  const payload = JSON.stringify(github.context.payload);
  // console.log(payload);

  var commitMessage; 
  if (JSON.parse(payload).hasOwnProperty("pull_request")){
    url = JSON.stringify(github.context.payload.pull_request.commits_url);
    (async function(){
      let res = await axios.get(url);
      commitMessage = JSON.stringify(res.data[0].commit.message);
      console.log(commitMessage);

      const bashcmd = `./lint.sh ${commitMessage}`;
      console.log(bashcmd);
      process.execSync(bashcmd);
      
      const message = fs.readFileSync('error_message.txt');
      if (message.toString() != ""){
        throw new Error(message.toString());
      }
    })();
  }else{
    commitMessage = JSON.stringify(github.context.payload.commits[0].message);
    console.log(`Commit Message is: ${commitMessage}`);

    const bashcmd = `./lint.sh ${commitMessage}`;
    console.log(bashcmd);
    process.execSync(bashcmd);
    
    const message = fs.readFileSync('error_message.txt');
    if (message.toString() != ""){
      throw new Error(message.toString());
    }
  }
  // console.log(`Commit Message is: ${commitMessage}`);
} catch (error) {
  core.setFailed(error.message);
}
