/* Academic enrollment V10: a learner self-creates ONE Grade XI FBISE pilot enrollment.
   No browser code can grant teacher/admin permissions, memberships or promotions.
   Firestore rules, not this JavaScript, enforce the actual restrictions. */
import {doc,getDocFromServer,setDoc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';
const COLLECTION='academicEnrollments';
export const PILOT_GRADE=11;
export const PILOT_BOARD='fbise';
export async function readEnrollment(db,user){
 if(!db||!user?.uid||!user?.emailVerified)throw new Error('Verified login required');
 const snap=await getDocFromServer(doc(db,COLLECTION,user.uid));
 if(!snap.exists())return null;
 const data=snap.data();
 if(data.uid!==user.uid||data.grade!==PILOT_GRADE||data.board!==PILOT_BOARD||data.status!=='active'||data.type!=='independent')throw new Error('Enrollment requires administrator review');
 return data;
}
export async function createPilotEnrollment(db,user,{grade,board,institution}){
 if(!db||!user?.uid||!user?.emailVerified)throw new Error('Verified login required');
 if(Number(grade)!==PILOT_GRADE||board!==PILOT_BOARD)throw new Error('Only Grade XI / FBISE is currently available');
 if(typeof institution!=='string'||institution.length>120)throw new Error('Institution name must be 120 characters or less');
 const clean=institution.trim();
 if(clean.length>120)throw new Error('Institution name is too long');
 // setDoc creates the document. Repeat calls become updates, denied by rules.
 await setDoc(doc(db,COLLECTION,user.uid),{
   uid:user.uid,grade:PILOT_GRADE,board:PILOT_BOARD,
   institution:clean,status:'active',type:'independent',enrolledAt:serverTimestamp()
 });
 return readEnrollment(db,user);
}
