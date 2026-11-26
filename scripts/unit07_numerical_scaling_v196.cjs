#!/usr/bin/env node
'use strict';
/**
 * V196: SOURCE-BASED PHYSICS MATH ONLY. This is NOT an answer-key release,
 * original-textbook correction, teacher signoff, scored bank, or backend.
 *
 * Units must be SI at the function boundary:
 * length m, area m^2, force N, stress/moduli Pa, mass kg, energy J.
 *
 * Problem 7.1's idealized SHEAR proxy does not model true cantilever bending.
 */
function denied(code){throw Error('V196_DENIED: '+code);}
function shape(x,required,label){
 if(!x||typeof x!=='object'||Array.isArray(x))denied(label+'_OBJECT');
 if(JSON.stringify(Object.keys(x).sort())!==JSON.stringify([...required].sort()))
  denied(label+'_FIELDS_OR_UNITS');
}
function positive(x,label){
 if(typeof x!=='number'||!Number.isFinite(x)||x<=0)denied(label+'_MUST_BE_POSITIVE_FINITE');
 return x;
}
function nonNegative(x,label){
 if(typeof x!=='number'||!Number.isFinite(x)||x<0)denied(label+'_MUST_BE_NONNEGATIVE_FINITE');
 return x;
}
function uniformShearProxyMass(p){
 shape(p,['shearModulusPa','diameterM','displacementM','shearDepthM','gravityMS2'],'SHEAR');
 const G=positive(p.shearModulusPa,'SHEAR_MODULUS'),
 d=positive(p.diameterM,'DIAMETER'),dx=nonNegative(p.displacementM,'DISPLACEMENT'),
 depth=positive(p.shearDepthM,'SHEAR_DEPTH'),g=positive(p.gravityMS2,'GRAVITY');
 const area=Math.PI*d*d/4;
 const gamma=dx/depth;
 return Object.freeze({areaM2:area,shearStrain:gamma,shearForceN:G*gamma*area,
  apparentMassKg:G*gamma*area/g,model:'IDEALIZED_UNIFORM_SHEAR_NOT_CANTILEVER'});
}
function diameterForEqualExtension(p){
 shape(p,['firstDiameterM','firstYoungPa','secondYoungPa'],'EQUAL_EXTENSION');
 const d=positive(p.firstDiameterM,'FIRST_DIAMETER'),
 y1=positive(p.firstYoungPa,'FIRST_YOUNG'),
 y2=positive(p.secondYoungPa,'SECOND_YOUNG');
 return d*Math.sqrt(y1/y2);
}
function serialWireStretchAndEnergy(p){
 shape(p,['upperMassKg','lowerMassKg','upperLengthM','lowerLengthM',
  'upperYoungPa','lowerYoungPa','commonDiameterM','gravityMS2'],'SERIES_WIRES');
 const mu=nonNegative(p.upperMassKg,'UPPER_MASS'),
 ml=positive(p.lowerMassKg,'LOWER_MASS'),
 lu=positive(p.upperLengthM,'UPPER_LENGTH'),
 ll=positive(p.lowerLengthM,'LOWER_LENGTH'),
 yu=positive(p.upperYoungPa,'UPPER_YOUNG'),
 yl=positive(p.lowerYoungPa,'LOWER_YOUNG'),
 d=positive(p.commonDiameterM,'COMMON_DIAMETER'),
 g=positive(p.gravityMS2,'GRAVITY');
 const area=Math.PI*d*d/4,upperForce=(mu+ml)*g,lowerForce=ml*g;
 const upperExtension=upperForce*lu/(area*yu),lowerExtension=lowerForce*ll/(area*yl);
 const upperEnergy=.5*upperForce*upperExtension,lowerEnergy=.5*lowerForce*lowerExtension;
 return Object.freeze({areaM2:area,upperForceN:upperForce,lowerForceN:lowerForce,
  upperExtensionM:upperExtension,lowerExtensionM:lowerExtension,
  totalExtensionM:upperExtension+lowerExtension,upperEnergyJ:upperEnergy,
  lowerEnergyJ:lowerEnergy,totalEnergyJ:upperEnergy+lowerEnergy});
}
function strainEnergyFromStress(p){
 shape(p,['crossSectionM2','lengthM','stressPa','youngPa'],'STRAIN_ENERGY');
 const a=positive(p.crossSectionM2,'CROSS_SECTION'),
 l=positive(p.lengthM,'LENGTH'),stress=nonNegative(p.stressPa,'STRESS'),
 young=positive(p.youngPa,'YOUNG');
 return (a*l*stress*stress)/(2*young);
}
function tensileStress(p){
 shape(p,['forceN','diameterM'],'TENSILE_STRESS');
 const force=nonNegative(p.forceN,'FORCE'),d=positive(p.diameterM,'DIAMETER');
 return 4*force/(Math.PI*d*d);
}
function forceExtensionPowerLawAreas(p){
 shape(p,['coefficientSI','extensionM','power'],'POWER_LAW_GRAPH');
 const k=positive(p.coefficientSI,'COEFFICIENT'),
 X=positive(p.extensionM,'EXTENSION'),power=positive(p.power,'POWER');
 // For F(x)=k*x^power, on 0<=x<=X:
 // W=∫F dx ; reversed-axes area=∫x dF.
 const workJ=k*X**(power+1)/(power+1);
 const reversedAxesNumericalArea=power*workJ;
 return Object.freeze({workJ,reversedAxesNumericalArea,
  numericalAreaRatio:power,identicalOnlyForLinearOriginCase:power===1,
  forceVerticalExtensionHorizontalIsWorkGraph:true});
}
module.exports={uniformShearProxyMass,diameterForEqualExtension,
 serialWireStretchAndEnergy,strainEnergyFromStress,tensileStress,forceExtensionPowerLawAreas};
