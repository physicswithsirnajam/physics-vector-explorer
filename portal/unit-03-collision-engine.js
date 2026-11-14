/* Physics with Sir Najam — Grade XI Unit 3 Part 2 collision concepts.
 * Numerical model: ideal instantaneous head-on 1D collisions in an isolated system.
 * Generic inelastic collisions need more information; "stick" is the special
 * perfectly inelastic instructional example where both objects move together.
 * Air resistance: qualitative guidance only, not a numerical drag prediction.
 */
(function(root, factory) {
  "use strict";
  const library=factory();
  if(typeof module==="object" && module.exports)module.exports=library;
  if(root)root.PSNUnit3Collisions=library;
})(typeof window!=="undefined" ? window : null,function(){
  "use strict";
  const presets=Object.freeze([
    Object.freeze({id:"textbook-3.7",label:"Textbook Example 3.7 · p. 48",m1:5,m2:10,u1:10,u2:5,type:"elastic"}),
    Object.freeze({id:"equal-masses",label:"Equal masses exchange speeds",m1:2,m2:2,u1:8,u2:0,type:"elastic"}),
    Object.freeze({id:"opposing",label:"Two approaching objects",m1:2,m2:3,u1:4,u2:-2,type:"elastic"}),
    Object.freeze({id:"stick",label:"Objects stick together",m1:3,m2:2,u1:8,u2:-1,type:"stick"})
  ]);
  const topics=Object.freeze({
    range:Object.freeze({
      title:"Range generally decreases",
      noDrag:"Ideal projectile: R = u² sin(2θ)/g for equal launch and landing heights.",
      withDrag:"With air resistance opposing the motion, horizontal speed reduces and the landing range is generally shorter.",
      caution:"The illustrated curves are qualitative and not calculated trajectories. Actual range depends on drag, shape, mass and launch conditions."
    }),
    horizontal:Object.freeze({
      title:"Horizontal component is no longer constant",
      noDrag:"Without air resistance, aₓ = 0, so the horizontal velocity stays constant.",
      withDrag:"While moving forward through air, the resistive force has a backward component, so horizontal speed decreases.",
      caution:"The real drag force depends on speed and physical conditions. This lesson does not assume a particular drag equation."
    }),
    vertical:Object.freeze({
      title:"Vertical motion is changed on ascent and descent",
      noDrag:"Without air resistance, vertical acceleration is −g throughout the flight when upward is positive.",
      withDrag:"Air resistance opposes velocity: it acts downward on the way up and upward on the way down. The vertical acceleration is not generally a constant −g.",
      caution:"On descent a falling object can approach terminal speed; the exact motion depends on the drag model."
    }),
    peak:Object.freeze({
      title:"Maximum height is generally reduced",
      noDrag:"With no drag and equal start/end levels, H = u²sin²θ/(2g).",
      withDrag:"During ascent the downward drag component adds to gravity, so an otherwise identical launch generally reaches a lower maximum height.",
      caution:"The no-drag H formula must not be used to calculate a numerical height with air resistance."
    })
  });
  const fmt=(value,digits=2)=>{
    const x=Number(value.toFixed(digits));
    return String(Object.is(x,-0)?0:x);
  };
  function finiteInRange(x,lo,hi,name){
    if(!Number.isFinite(x)||x<lo||x>hi)throw RangeError(name+" must be a finite number from "+lo+" to "+hi);
    return x;
  }
  function collision(m1,m2,u1,u2,type="elastic"){
    finiteInRange(m1,0.1,100,"m1");
    finiteInRange(m2,0.1,100,"m2");
    finiteInRange(u1,-100,100,"u1");
    finiteInRange(u2,-100,100,"u2");
    if(type!=="elastic"&&type!=="stick")throw Error("Unknown collision type");
    if(u1<=u2)throw RangeError("With object 1 initially to the left, u1 must exceed u2 for the bodies to approach and collide");
    const mass=m1+m2;
    const momentumBefore=m1*u1+m2*u2;
    const kineticBefore=0.5*m1*u1*u1+0.5*m2*u2*u2;
    let v1,v2;
    if(type==="elastic"){
      v1=((m1-m2)*u1+2*m2*u2)/mass;
      v2=(2*m1*u1+(m2-m1)*u2)/mass;
    }else{
      v1=momentumBefore/mass;
      v2=v1;
    }
    const momentumAfter=m1*v1+m2*v2;
    const kineticAfter=0.5*m1*v1*v1+0.5*m2*v2*v2;
    const loss=Math.max(0,kineticBefore-kineticAfter);
    const result={
      m1,m2,u1,u2,v1,v2,type,
      momentumBefore,momentumAfter,
      kineticBefore,kineticAfter,kineticLoss:loss,
      approachSpeed:u1-u2,separationSpeed:v2-v1,
      totalMass:mass,
      assumptions:"Isolated, one-dimensional head-on interaction; object 1 starts to the left and approaches object 2."
    };
    return Object.freeze(result);
  }
  function checkConservation(result){
    if(!result||!Number.isFinite(result.momentumBefore))throw Error("Invalid collision result");
    const scale=Math.max(1,Math.abs(result.momentumBefore),Math.abs(result.momentumAfter));
    return Object.freeze({
      momentumConserved:Math.abs(result.momentumBefore-result.momentumAfter)<1e-9*scale,
      energyConserved:Math.abs(result.kineticBefore-result.kineticAfter)<1e-9*Math.max(1,result.kineticBefore),
      kineticEnergyLost:result.kineticLoss,
      relativeSpeedRuleHolds:Math.abs(result.approachSpeed-result.separationSpeed)<1e-9*Math.max(1,result.approachSpeed)
    });
  }
  function topic(name){
    if(!Object.prototype.hasOwnProperty.call(topics,name))throw Error("Unknown air-resistance concept");
    return topics[name];
  }
  return Object.freeze({presets,topics:Object.keys(topics),topic,collision,checkConservation,fmt});
});
