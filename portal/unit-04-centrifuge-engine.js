/* Physics with Sir Najam — Unit 4 centrifugal separation (NBF XI p.63).
 * FBISE P-11-B-21: justify centrifuge separation using centripetal motion.
 * This model quantifies centripetal acceleration DEMAND a=ω²r;
 * it does not calculate sedimentation speed, purity, residence time,
 * drag, buoyancy or a human/medical safety limit.
 */
(function(root,factory){
 "use strict";
 const m=factory();
 if(typeof module==="object"&&module.exports)module.exports=m;
 if(root)root.PSNUnit4Centrifuge=m;
})(typeof window!=="undefined"?window:null,function(){
 "use strict";
 const TAU=2*Math.PI,G=9.8;
 const examples=Object.freeze({
  suspension:Object.freeze({name:"Suspended particles in a liquid",density:"Denser suspended material can collect at the outer-end (bottom) of the spinning tube, leaving lighter liquid nearer the rotation axis.",source:"NBF Physics XI p.63, Figure 4.11"}),
  cream:Object.freeze({name:"Cream separator",density:"The source describes separation of milk into cream and skimmed milk. Fat-rich cream is the lighter fraction; heavier skim-milk fraction tends farther outward in a rotating separation chamber.",source:"NBF Physics XI p.63"}),
  laundry:Object.freeze({name:"Washing-machine spin dryer",density:"The perforated rotating drum constrains the clothing to spin. Water not retained with the fabric can pass through drum holes and separate. In an inertial frame it continues on its instantaneous trajectory when a required inward force is absent.",source:"NBF Physics XI p.63 and exercise p.75"})
 });
 function range(n,lo,hi,label){
  if(typeof n!=="number"||!Number.isFinite(n)||n<lo||n>hi)
   throw RangeError(label+" must be a finite number in ["+lo+", "+hi+"]");
  return n;
 }
 function model(rpm,radius,massGrams=2){
  range(rpm,0,12000,"rpm");
  range(radius,.001,10,"radius");
  range(massGrams,.001,10000,"massGrams");
  const omega=rpm*TAU/60;
  const a=omega*omega*radius;
  const massKg=massGrams/1000;
  const force=massKg*a;
  return Object.freeze({
   rpm,radius,massGrams,omegaRadPerSec:omega,
   revolutionsPerSecond:rpm/60,periodSeconds:rpm===0?null:60/rpm,
   centripetalAcceleration:a,radialAccelerationInG:a/G,
   neededInwardForce:force,
   physicalInterpretation:"For a mass to remain on a circular path of radius r at speed ω, its net inward (centripetal) force must be mω²r. If inward force on a particle is insufficient relative to the rotating mixture, it may move outward relative to the container.",
   distinction:"In the laboratory/inertial frame there is no extra real outward centrifugal force. In a co-rotating frame the apparent outward centrifugal effect describes relative separation. Actual sedimentation depends on density difference, buoyancy, viscous drag, fluid and container properties.",
   caveat:"Acceleration-demand illustration, NOT a prediction of settling rate, yield, sample safety, clinical use, or centrifugal effectiveness at any specific time."
  });
 }
 function comparison(rpm,radius,massGrams=2){
  const base=model(rpm,radius,massGrams);
  const doubledSpeed=model(rpm*2,radius,massGrams);
  const doubledRadius=model(rpm,radius*2,massGrams);
  return Object.freeze({
   base,twiceRPM:doubledSpeed,twiceRadius:doubledRadius,
   rpmMultiplier:4,radiusMultiplier:2,
   statement:"At fixed radius and mass, twice the rpm needs four times the inward acceleration and force. At fixed rpm, twice the radius needs twice the inward acceleration and force. This does not mean sedimentation time follows those same multipliers."
  });
 }
 function format(n,places=2){
  if(typeof n!=="number"||!Number.isFinite(n))throw RangeError("format requires finite number");
  range(places,0,6,"places");if(!Number.isInteger(places))throw RangeError("places must be integer");
  const val=Number(n.toFixed(places));
  return String(Object.is(val,-0)?0:val);
 }
 return Object.freeze({TAU,G,examples,model,comparison,format});
});