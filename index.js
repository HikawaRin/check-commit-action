const core = require('@actions/core');
const github = require('@actions/github');
const process = require('child_process');
const fs = require('fs');

try {
  // `who-to-greet` input defined in action metadata file
  const use_strict = core.getInput('use_strict');

  const payload = JSON.stringify(github.context.payload);
  // console.log(payload);

  var commitMessage; 
  if (JSON.parse(payload).hasOwnProperty("pull_request")){
    commitMessage = JSON.stringify(github.context.payload.pull_request.commits_url);
  }else{
    commitMessage = JSON.stringify(github.context.payload.commits[0].message);
  }
  console.log(`Commit Message is: ${commitMessage}`);
  process.execSync(`./lint.sh \"${commitMessage}\"`);
  
  const message = fs.readFileSync('error_message.txt');
  core.setOutput("result", message.toString());
} catch (error) {
  core.setFailed(error.message);
}
