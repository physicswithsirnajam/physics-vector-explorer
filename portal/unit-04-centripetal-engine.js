/* Physics with Sir Najam — Unit 4 Part 2: pure centripetal-motion math.
 * NBF Grade XI Unit 4 printed pp.59–64 and FBISE summative P-11-B-10/14/15.
 * Physics: uniform-speed circular motion. The inward *net* force is not an
 * additional force; friction, normal-force component, tension or gravity
 * can provide that resultant. No outward centrifugal force in inertial frame.
 */
(function(root,factory){
 "use strict";
 const moduleApi=factory();
 if(typeof module==="object"&&module.exports)module.exports=moduleApi;
 if(root)root.PSNUnit4Centripetal=moduleApi;
})(typeof window!=="undefined"?window:null,function(){
 "use strict";
 const G=9.8;
 function finite(n,min,max,label){
  if(typeof n!=="number"||!Number.isFinite(n)||n<min||n>max)
   throw RangeError(label+" must be a finite number from "+min+" to "+max);
  return n;
 }
 function circle(mass,speed,radius){
  finite(mass,.001,1e7,"mass");
  finite(speed,0,1e5,"speed");
  finite(radius,.001,1e7,"radius");
  const omega=speed/radius;
  const acceleration=speed*speed/radius;
  const netForce=mass*acceleration;
  return Object.freeze({mass,speed,radius,angularSpeed:omega,
   centripetalAcceleration:acceleration,centripetalNetForce:netForce,
   tangentialAcceleration:0,
   direction:"Both centripetal acceleration and the net centripetal force point toward the center at every point. Tangential velocity is perpendicular to radius.",
   assumption:"Instantaneous constant speed on a circular path; no tangential acceleration. A net inward force is required."});
 }
 function frictionlessBank(speed,radius,g=G){
  finite(speed,0,1e5,"speed");
  finite(radius,.001,1e7,"radius");
  finite(g,.001,100,"gravity");
  const tanTheta=speed*speed/(radius*g);
  const radians=Math.atan(tanTheta);
  return Object.freeze({speed,radius,gravity:g,tanTheta,angleRadians:radians,
   angleDegrees:radians*180/Math.PI,
   assumption:"Friction-free ideal bank, level circular turn, zero vertical acceleration. N sinθ = mv²/r and N cosθ = mg, hence tanθ = v²/(rg). Mass cancels."});
 }
 function vectors(angle,direction="ccw"){
  finite(angle,-1e7,1e7,"angle");
  if(direction!=="ccw"&&direction!=="cw")throw RangeError("direction must be ccw or cw");
  const x=Math.cos(angle),y=Math.sin(angle);
  const sign=direction==="ccw"?1:-1;
  return Object.freeze({
   position:Object.freeze([x,y]),
   inward:Object.freeze([-x,-y]),
   velocity:Object.freeze([-sign*y,sign*x]),
   note:"Coordinates use positive y upward, with signed tangential velocity determined by rotation direction."});
 }
 function example42(){
  const mass=856,speed=12,force=7250;
  const radius=mass*speed*speed/force;
  return Object.freeze({
   id:"NBF-4.2",sourcePage:63,sourceContinuationPage:64,
   mass,speed,force,radius,
   textbookRoundedRadius:17,
   calculated:circle(mass,speed,radius),
   note:"Textbook Example 4.2: calculate radius from the given centripetal force using r=mv²/F; 17 m after rounding."});
 }
 function scaling(mass,speed,radius){
  const base=circle(mass,speed,radius);
  return Object.freeze({
   base:base.centripetalNetForce,
   doubleSpeed:circle(mass,2*speed,radius).centripetalNetForce,
   doubleRadius:circle(mass,speed,2*radius).centripetalNetForce,
   doubleMass:circle(2*mass,speed,radius).centripetalNetForce,
   ratioDoubleSpeed:4,
   ratioDoubleRadius:.5,
   ratioDoubleMass:2,
   note:"Holding other quantities constant: Fc ∝ m v²/r; at speed=0 all absolute forces are zero, although proportional dependence still holds."});
 }
 function format(n,digits=2){
  if(typeof n!=="number"||!Number.isFinite(n))throw RangeError("format needs a finite number");
  finite(digits,0,6,"digits");
  if(!Number.isInteger(digits))throw RangeError("digits must be integer");
  const x=Number(n.toFixed(digits));
  return String(Object.is(x,-0)?0:x);
 }
 return Object.freeze({G,circle,frictionlessBank,vectors,example42,scaling,format});
});