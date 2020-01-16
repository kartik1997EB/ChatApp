import * as functions from 'firebase-functions';


import * as admin from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();



export  const taskRunner = functions.runWith( {memory:'1GB'}).pubsub.schedule('* * * * *')
.onRun(async contxt => {

    const now = admin.firestore.Timestamp.now();

    const query = db.collection('WishScheduler').where('performAt','<=',now).where('status','==','scheduled');

    const task = await query.get();

    task.forEach(snapshot =>{

        console.log(snapshot.data());


        snapshot.ref.update({status:'complete'}).then(()=>{
            db.collection(snapshot.data()['bucketId']).add({userId : snapshot.data()['sendBy'],
            msg : snapshot.data()['wishMsg'],
            isMIME : false,
            time :now,
            }).then((sucsses)=>{
                    db.collection(snapshot.data()['friendId']+'friend').where('friendId','==',snapshot.data()['sendBy']).get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(snap=>{
                            snap.ref.update({
                                recentChatTime:now
                            }).then(()=>{
                                console.log('friend recent time updated successfully')
                            })
                            .catch(()=>{
                                console.log('error friend recent time updatation')
                            })
                        });
                          console.log("successully updated  time"); 
                    }).
                    catch((err)=>{
                        console.log("err in updated  time for reciver",err); 
                    })

                    db.collection(snapshot.data()['sendBy']+'friend').where('friendId','==',snapshot.data()['sendBy']).get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(snap=>{
                            snap.ref.update({
                                recentChatTime:now
                            }).then(()=>{
                                console.log('friend recent time updated successfully')
                            })
                            .catch(()=>{
                                console.log('error friend recent time updatation')
                            })
                        });
                          console.log("successully updated  time"); 
                    }).
                    catch((err)=>{
                        console.log("err in updated  time for sender",err); 
                    })

                })
                .catch((err)=>{
                    console.log(err);
                })
            })
        .catch((err)=>{
            console.log(err);
        })
       

    })
  
})

