/* Physics with Sir Najam — NBF Grade XI Unit 4 Part 4.
 * Pure fixed-axis rotational physics for summative SLOs B-18/B-19/B-20.
 * Textbook pp.64–71: I=Σmr², L=Iω, τ=dL/dt=Iα for fixed I, 
 * and L conserved when net external torque is zero.
 */
(function(root,factory){
"use strict";
const api=factory();
if(typeof module==="object"&&module.exports)module.exports=api;
if(root)root.PSNUnit4Angular=api;
})(typeof window!=="undefined"?window:null,function(){
"use strict";
const TAU=2*Math.PI;
const factors=Object.freeze({
 "point":Object.freeze({label:"Point mass",value:1,expression:"I = MR²"}),
 "hoop":Object.freeze({label:"Thin hoop / ring",value:1,expression:"I = MR²"}),
 "disk":Object.freeze({label:"Uniform solid disc",value:.5,expression:"I = ½MR²"}),
 "sphere":Object.freeze({label:"Uniform solid sphere",value:2/5,expression:"I = ⅖MR²"}),
 "shell":Object.freeze({label:"Thin spherical shell",value:2/3,expression:"I = ⅔MR²"})
});
function bounded(n,min,max,label){
 if(typeof n!=="number"||!Number.isFinite(n)||n<min||n>max)
  throw RangeError(label+" must be a finite number in ["+min+", "+max+"]");
 return n;
}
function moment(shape,mass,radius){
 if(!Object.prototype.hasOwnProperty.call(factors,shape))throw RangeError("Unknown symmetric mass model");
 bounded(mass,.01,100000,"mass");
 bounded(radius,.001,10000,"radius");
 const formula=factors[shape];
 return Object.freeze({shape,mass,radius,factor:formula.value,expression:formula.expression,
  value:formula.value*mass*radius*radius,
  unit:"kg m²",
  reference:"NBF Physics XI printed p.64, Fig. 4.13; point-mass/hoop/disc/solid or hollow sphere moments about the central specified axis."});
}
function rpmToRadPerSec(rpm){
 bounded(rpm,-1e6,1e6,"rpm");return rpm*TAU/60;
}
function radPerSecToRPM(radPerSec){
 bounded(radPerSec,-1e6,1e6,"radPerSec");return radPerSec*60/TAU;
}
function rotor(shape,mass,radius,initialRPM,externalTorque,time){
 bounded(initialRPM,-1e5,1e5,"initialRPM");
 bounded(externalTorque,-1e6,1e6,"externalTorque");
 bounded(time,0,1e4,"time");
 const body=moment(shape,mass,radius);
 const I=body.value,omega0=rpmToRadPerSec(initialRPM);
 const alpha=externalTorque/I;
 const omega=omega0+alpha*time;
 const angle=omega0*time+.5*alpha*time*time;
 const L0=I*omega0,L=I*omega;
 const turnTime=externalTorque===0?null:-L0/externalTorque;
 const reverses=turnTime!==null&&turnTime>0&&turnTime<time;
 const turnAngle=reverses?omega0*turnTime+.5*alpha*turnTime*turnTime:0;
 const totalAngle=reverses?Math.abs(turnAngle)+Math.abs(angle-turnAngle):Math.abs(angle);
 return Object.freeze({
  moment:body,initialRPM,externalTorque,time,
  initialOmega:omega0,alpha,finalOmega:omega,
  angularDisplacement:angle,angularDistance:totalAngle,
  initialL:L0,finalL:L,deltaL:L-L0,torqueImpulse:externalTorque*time,
  initialKE:.5*I*omega0*omega0,finalKE:.5*I*omega*omega,
  reversalTime:reverses?turnTime:null,reverses,
  note:"A constant external net torque acts about a fixed, specified axis while the rigid body's moment of inertia stays constant. A signed velocity may reverse after stopping; negative torque does not universally mean deceleration.",
  identity:"Lfinal−Linitial=τnet Δt and α=τnet/I. If τnet=0 and I is fixed then ω stays constant."
 });
}
function skater(eachHandMass,initialRadius,finalRadius,coreMoment,initialRPM){
 bounded(eachHandMass,.01,1000,"eachHandMass");
 bounded(initialRadius,.01,100,"initialRadius");
 bounded(finalRadius,.01,100,"finalRadius");
 bounded(coreMoment,.001,10000,"coreMoment");
 bounded(initialRPM,-1000,1000,"initialRPM");
 const I0=coreMoment+2*eachHandMass*initialRadius**2;
 const If=coreMoment+2*eachHandMass*finalRadius**2;
 const w0=rpmToRadPerSec(initialRPM),L=I0*w0,wf=L/If;
 return Object.freeze({
  eachHandMass,initialRadius,finalRadius,coreMoment,initialRPM,
  initialMoment:I0,finalMoment:If,
  initialOmega:w0,finalOmega:wf,finalRPM:radPerSecToRPM(wf),
  angularMomentum:L,initialKE:.5*I0*w0*w0,finalKE:.5*If*wf*wf,
  inertiaRatio:If/I0,rotationRateRatio:I0/If,
  note:"Two identical point masses represent hand-held masses; the rest of the skater has a fixed axial moment. With negligible net external torque L=Iω remains constant. Kinetic energy need NOT stay constant: skater's internal work can change it."
 });
}
function example43(){
 const mass=3.6,radius=.31,initialRPM=1150,stoppingTime=7.8;
 const initial=rotor("disk",mass,radius,initialRPM,0,0);
 const stoppingTorque=-initial.initialL/stoppingTime;
 const stopped=rotor("disk",mass,radius,initialRPM,stoppingTorque,stoppingTime);
 return Object.freeze({source:"NBF Physics XI Unit 4, Example 4.3, printed p.70",
  mass,radius,initialRPM,stoppingTime,stoppingTorque,
  initialMoment:initial.moment.value,initialAngularSpeed:initial.initialOmega,
  initialAngularMomentum:initial.initialL,stopped,
  sourceRounded:Object.freeze({angularMomentum:"20.83 kg m²/s",torque:"−2.67 N m"}),
  note:"Uniform solid cylindrical grinding wheel treated as a disc about its centre; external average torque assumed constant for the modeled stop. Textbook rounding: ω≈120.4 rad/s."});
}
function format(n,digits=2){
 if(typeof n!=="number"||!Number.isFinite(n))throw RangeError("format requires a finite number");
 bounded(digits,0,6,"digits");if(!Number.isInteger(digits))throw RangeError("digits must be integer");
 const x=Number(n.toFixed(digits));return String(Object.is(x,-0)?0:x);
}
return Object.freeze({TAU,factors,moment,rpmToRadPerSec,radPerSecToRPM,rotor,skater,example43,format});
});