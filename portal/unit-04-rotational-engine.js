/* Physics with Sir Najam — Unit 4 Part 1 pure rotation kinematics.
 * NBF Grade XI Physics Unit 4 pp.54–59: radians, angular quantities,
 * s=rθ, v=rω, tangential a=rα and constant angular acceleration.
 * FBISE summative SLOs P-11-B-07, B-08, B-09.
 * Centripetal acceleration/force belong to subsequent lessons; this engine
 * does not imply tangential acceleration is the total acceleration in a circle.
 */
(function(root,factory){
 "use strict";
 const model=factory();
 if(typeof module==="object"&&module.exports)module.exports=model;
 if(root)root.PSNUnit4Rotational=model;
})(typeof window!=="undefined"?window:null,function(){
 "use strict";
 const TAU=2*Math.PI;
 const examples=Object.freeze({
   bicycleTyre:Object.freeze({id:"textbook-4.1",label:"NBF Example 4.1 · bicycle tyre stopping",radius:0.331,initialLinearSpeed:6.80,stoppingDistance:74.8})
 });
 function range(n,lower,upper,label){
   if(typeof n!=="number"||!Number.isFinite(n)||n<lower||n>upper)
     throw RangeError(label+" must be finite between "+lower+" and "+upper);
   return n;
 }
 function tidy(x,dp=2){
   const n=Number(x.toFixed(dp));return String(Object.is(n,-0)?0:n);
 }
 function radiansFromDegrees(degrees){range(degrees,-1440,1440,"degrees");return degrees*Math.PI/180;}
 function degreesFromRadians(radians){range(radians,-10000,10000,"radians");return radians*180/Math.PI;}
 function circleArc(radius,angularDegrees){
   range(radius,.01,100,"radius");range(angularDegrees,-360,360,"angularDegrees");
   const theta=radiansFromDegrees(angularDegrees);
   return Object.freeze({radius,angularDegrees,radians:theta,arcLength:radius*theta,
     arcDistance:Math.abs(radius*theta),revolutions:theta/TAU,
     note:"s = rθ is signed arc displacement for the selected angular direction; distance is its magnitude if direction does not reverse."});
 }
 function rotating(radius,omega0,alpha,t){
   range(radius,.01,100,"radius");
   range(omega0,-200,200,"omega0");
   range(alpha,-50,50,"alpha");
   range(t,0,100,"time");
   const theta=omega0*t+.5*alpha*t*t;
   const omega=omega0+alpha*t;
   const turn=alpha===0?null:-omega0/alpha;
   const reverses=turn!==null&&turn>0&&turn<t;
   const thetaAtTurn=reverses?omega0*turn+.5*alpha*turn*turn:0;
   const angularDistance=reverses?Math.abs(thetaAtTurn)+Math.abs(theta-thetaAtTurn):Math.abs(theta);
   const r=Object.freeze({
     radius,omega0,alpha,time:t,theta,omega,
     revolutions:theta/TAU,angularDistance,
     linearArcDisplacement:radius*theta,
     rimDistance:radius*angularDistance,
     signedTangentialVelocity:radius*omega,
     signedTangentialAcceleration:radius*alpha,
     identityLeft:omega*omega,identityRight:omega0*omega0+2*alpha*theta,
     reverses,reversalTime:reverses?turn:null,
     assumptions:"Fixed-radius rigid-body rotation with constant angular acceleration. Signs use anticlockwise positive. Tangential acceleration is a component, not the total acceleration."
   });
   return r;
 }
 function sampleRotation(radius,omega0,alpha,until,steps=60){
   range(until,0,100,"until");range(steps,2,200,"steps");
   if(!Number.isInteger(steps))throw RangeError("steps must be an integer");
   return Array.from({length:steps+1},(_,i)=>rotating(radius,omega0,alpha,until*i/steps));
 }
 function bicycleTyreExercise(){
   const {radius,initialLinearSpeed,stoppingDistance}=examples.bicycleTyre;
   const initialOmega=initialLinearSpeed/radius;
   const theta=stoppingDistance/radius;
   const numberOfRevolutions=theta/TAU;
   const alpha=-initialOmega*initialOmega/(2*theta);
   const stoppingTime=-initialOmega/alpha;
   return Object.freeze({
     radius,initialLinearSpeed,stoppingDistance,initialOmega,theta,
     numberOfRevolutions,alpha,stoppingTime,
     textbookPublishedValues:Object.freeze({initialOmega:"20.54 rad/s",revolutions:"35.9 rev",alpha:"−0.94 rad/s²",time:"21.9 s"}),
     roundingNote:"The textbook rounds intermediate results; calculations retaining all input precision give slightly different rounded α, revolutions and stopping time.",
     assumptions:"No slipping of the tyre, constant angular deceleration, tyre stops at the end of 74.8 m."
   });
 }
 return Object.freeze({TAU,examples,tidy,radiansFromDegrees,degreesFromRadians,circleArc,rotating,sampleRotation,bicycleTyreExercise});
});