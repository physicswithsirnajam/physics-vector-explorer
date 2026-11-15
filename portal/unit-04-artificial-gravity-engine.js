/* Physics with Sir Najam — Grade XI Unit 4 Part 3 pure numerical model.
 * Based on NBF XI Physics printed pp.71–73, section 4.6/4.7, Example 4.4;
 * FBISE summative SLOs P-11-B-16 and P-11-B-17.
 * Ideal rotating ring, radial floor normal, no friction, spin-up transients,
 * structural forces, physiological adaptation or orbital mechanics predicted.
 */
(function(root,factory){
 "use strict";
 const m=factory();
 if(typeof module==="object"&&module.exports)module.exports=m;
 if(root)root.PSNUnit4ArtificialGravity=m;
})(typeof window!=="undefined"?window:null,function(){
 "use strict";
 const TWO_PI=2*Math.PI;
 const STANDARD_G=9.8;
 function requireRange(n,min,max,label){
  if(typeof n!=="number"||!Number.isFinite(n)||n<min||n>max)
   throw RangeError(label+" must be finite and between "+min+" and "+max);
  return n;
 }
 function calculate(radiusMetres,rpm,personMassKg=70){
  requireRange(radiusMetres,.1,1e6,"radiusMetres");
  requireRange(rpm,0,120,"rpm");
  requireRange(personMassKg,.1,1e5,"personMassKg");
  const omega=rpm*TWO_PI/60;
  const acceleration=omega*omega*radiusMetres;
  const rimSpeed=omega*radiusMetres;
  const floorNormal=personMassKg*acceleration;
  const periodSeconds=rpm>0?60/rpm:null;
  const frequencyHz=rpm/60;
  return Object.freeze({
   radiusMetres,rpm,personMassKg,
   omegaRadPerSec:omega,rimSpeedMetresPerSec:rimSpeed,
   centripetalAcceleration:acceleration,effectiveGravityRatio:acceleration/STANDARD_G,
   floorNormalNewtons:floorNormal,periodSeconds,frequencyHz,
   physicalForce:"The ring floor pushes the occupant toward the rotation axis; this is the real inward normal force required for circular motion.",
   rotatingFrameNote:"The occupant experiences a gravity-like sensation toward the outer rim. The outward 'centrifugal force' is a fictitious force used in the rotating reference frame, not an extra outward contact force in an inertial frame.",
   limitations:"Ideal rigid ring and co-rotating person. No Earth gravity in the ring model; ignores transient Coriolis effects, comfort limits, station strength and real-world engineering."
  });
 }
 function designForGravity(radiusMetres,targetAcceleration=STANDARD_G,personMassKg=70){
  requireRange(radiusMetres,.1,1e6,"radiusMetres");
  requireRange(targetAcceleration,0,100,"targetAcceleration");
  requireRange(personMassKg,.1,1e5,"personMassKg");
  const omega=Math.sqrt(targetAcceleration/radiusMetres);
  const rpm=omega*60/TWO_PI;
  if(rpm>120)throw RangeError("Target rotation exceeds this model's 120 rpm limit");
  return calculate(radiusMetres,rpm,personMassKg);
 }
 function textbook44(){
  const design=designForGravity(1500,STANDARD_G,70);
  return Object.freeze({source:"NBF XI Physics Example 4.4, printed p.73",
   radiusMetres:1500,requestedAcceleration:STANDARD_G,
   calculated:design,
   textbookValues:Object.freeze({omega:"0.08 rad/s",period:"77.73 s",frequency:"0.013 Hz"}),
   note:"Keep full precision while solving. The printed book rounds angular velocity to two decimal places; its period and frequency correspond to the unrounded value."});
 }
 function assignment44(){
  const scenario=calculate(4,20,70);
  return Object.freeze({source:"NBF XI Physics Assignment 4.4, printed p.74",
   diameterMetres:8,radiusMetres:4,rpm:20,calculated:scenario,
   note:"Radius is half the stated 8 m diameter; acceleration is ω²R. Calculated rotation is illustrative, not a recommendation for human habitation."});
 }
 function conceptualWeightlessness(){
  return Object.freeze({
   orbitingStation:"In ideal circular orbit both crew and vehicle accelerate together toward Earth under gravity.",
   gravityPresent:true,
   gravityDirection:"toward Earth",
   supportForce:"For an astronaut freely floating inside the cabin, the floor's normal support is approximately zero.",
   apparentWeight:"approximately zero",
   caveat:"Weightlessness describes lack of supporting contact force; it does not mean gravity vanishes. Real orbital conditions can include small residual accelerations.",
   textbookContext:"NBF printed p.71 describes apparent weightlessness during orbital free fall. Explanations using a centrifugal/inertial balance refer to the rotating reference frame; gravity remains the real inward force in an inertial frame."
  });
 }
 function format(number,decimals=2){
  if(typeof number!=="number"||!Number.isFinite(number))throw RangeError("number must be finite");
  requireRange(decimals,0,6,"decimals");
  if(!Number.isInteger(decimals))throw RangeError("decimals must be an integer");
  const x=Number(number.toFixed(decimals));
  return String(Object.is(x,-0)?0:x);
 }
 return Object.freeze({TWO_PI,STANDARD_G,calculate,designForGravity,textbook44,assignment44,conceptualWeightlessness,format});
});