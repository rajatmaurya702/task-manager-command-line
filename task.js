const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
var fs = require("fs");

const pending_path = "pending.txt"
const completed_path = "completed.txt"


function check_for_file_existence(){
    if (!fs.existsSync(pending_path)) {
        fs.writeFile(pending_path, '', function (err) {
            if (err) throw err;
        });
    }
    if(!fs.existsSync(completed_path)){
        fs.writeFile(completed_path, '', function (err) {
            if (err) throw err;
        });
    }
}


var pending = [];
var completed = [];

function get_pend(){
    // console.log("RUN get_pend");
   var temp = "";
   const data = fs.readFileSync('pending.txt',
            {encoding:'utf8', flag:'r'});
       
        temp = data.toString();
        temp = temp.split(/[\r\n]+/);
        var temp1 = []
        temp.forEach((t)=>{
            temp1.push({task: t.split("::")[0], priority: parseInt(t.split("::")[1])});
        })

        temp1.sort((a, b)=>{
            if(a.priority < b.priority){
                return -1;
            }
            else return 1;
        });
        pending = temp1;
        // console.log(pending);
        const n = pending.length
        if(n && pending[n-1].task === ''){
            pending.splice(n -1, 1);
        }
}

function put_pend(){
    var temp_str = "";
    pending.forEach((elmet)=>{
        temp_str += (elmet.task + "::" + elmet.priority.toString() + "\n");
    });
    
    fs.writeFileSync("pending.txt", temp_str, (err)=>{
        if(err) throw err;
    });
}
// put_pend();

function get_comp(){
    // console.log("RUN get_pend");
    var temp = "";
    const data = fs.readFileSync('completed.txt',
             {encoding:'utf8', flag:'r'});
         // console.log("hi");
         temp = data.toString();
         temp = temp.split(/[\r\n]+/);
         var temp1 = []
         temp.forEach((t)=>{
             temp1.push({task: t.split("::")[0], priority: parseInt(t.split("::")[1])});
         })
        
         completed = temp1;
        //  console.log(completed);
         const n = completed.length
         if(n && completed[n-1].task === ''){
             completed.splice(n -1, 1);
         }
}
function put_comp(){
    var temp_str = "";
    completed.forEach((elmet)=>{
        temp_str += (elmet.task + "::" + elmet.priority.toString() + "\n");
    });
    // temp_str.slice(0, temp_str.length - 1);
    // console.log(temp_str);
    fs.writeFileSync("completed.txt", temp_str, (err)=>{
        if(err) throw err;
    });
}


//default value on screen
const default_message = `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`

yargs(hideBin(process.argv))
 .command("$0", "", ()=>{}, ()=>{
     console.log(default_message);
    // fs.writeFileSync("task.txt", default_message, (err)=>{
    //     if(err) throw err;
    // })
 })
 .command("help", "", ()=>{}, ()=>{
     console.log(default_message);
    // fs.writeFileSync("task.txt", default_message, (err)=>{
    //     if(err) throw err;
    // })
})
 
.help(false)
.command("report", "",()=>{}, ()=>{
    check_for_file_existence();
    get_pend();
    get_comp();
    console.log("Pending :", pending.length);
    pending.forEach((task, id)=>{
        console.log(`${id + 1}. ${task.task} [${task.priority}]`);
    })
    console.log("\nCompleted :", completed.length);
    completed.forEach((task, id)=>{
        console.log(`${id + 1}. ${task.task}`);
    })
})
.command("add <priority> <task_name>", "", ()=>{}, (argv)=>{
    check_for_file_existence();
    get_pend();
    // console.log("ADD", pending);
    console.log(`Added task: "${argv.task_name}" with priority ${argv.priority}`);
    pending.push({task: argv.task_name,priority: argv.priority});
    // console.log(pending);
    pending.sort((a, b)=>{
        if(a.priority < b.priority){
            return -1;
        }
        else return 1;
    });
    put_pend();
})
// .command("add", "", ()=>{}, (argv)=>{
//     console.log("Error: Missing tasks string. Nothing added!");
// })
.command("ls", "pending print", ()=>{}, ()=>{
    check_for_file_existence();
    // console.log("hi");
    get_pend();
    pending.forEach((task, id)=>{
        console.log(`${id + 1}. ${task.task} [${task.priority}]`);
    })
})
.command("done <num>", "", ()=>{}, (argv)=>{
    check_for_file_existence();
    get_pend();
    get_comp();
    var temp = pending[argv.num - 1]
    pending.splice(argv.num - 1, 1);
    completed.push(temp);
    console.log("Marked item as done.");
    put_pend(); 
    put_comp();
})
.command("del <num>", "", ()=>{}, (argv)=>{
    check_for_file_existence();
    get_pend();
    pending.splice(argv.num - 1, 1);
    console.log(`Deleted task #${argv.num}`);
    put_pend();
})
.parse()

// const greeting = `Hello, ${options.name}!`;

// console.log(greeting);