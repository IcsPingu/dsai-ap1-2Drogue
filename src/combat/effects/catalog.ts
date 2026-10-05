import { FireBrandEffect } from './catalog/fire/FireBrandEffect';
import { FireExposureEffect } from './catalog/fire/FireExposureEffect';
import { FireSurgeEffect } from './catalog/fire/FireSurgeEffect';
import { FireWeaknessEffect } from './catalog/fire/FireWeaknessEffect';
import { FireAuraEffect } from './catalog/fire/FireAuraEffect';
import { FireWoundEffect } from './catalog/fire/FireWoundEffect';
import { FireEchoEffect } from './catalog/fire/FireEchoEffect';
import { FirePrisonEffect } from './catalog/fire/FirePrisonEffect';
import { FireMasteryEffect } from './catalog/fire/FireMasteryEffect';
import { FireCataclysmEffect } from './catalog/fire/FireCataclysmEffect';
import { FrostBrandEffect } from './catalog/frost/FrostBrandEffect';
import { FrostExposureEffect } from './catalog/frost/FrostExposureEffect';
import { FrostSurgeEffect } from './catalog/frost/FrostSurgeEffect';
import { FrostWeaknessEffect } from './catalog/frost/FrostWeaknessEffect';
import { FrostAuraEffect } from './catalog/frost/FrostAuraEffect';
import { FrostWoundEffect } from './catalog/frost/FrostWoundEffect';
import { FrostEchoEffect } from './catalog/frost/FrostEchoEffect';
import { FrostPrisonEffect } from './catalog/frost/FrostPrisonEffect';
import { FrostMasteryEffect } from './catalog/frost/FrostMasteryEffect';
import { FrostCataclysmEffect } from './catalog/frost/FrostCataclysmEffect';
import { LightningBrandEffect } from './catalog/lightning/LightningBrandEffect';
import { LightningExposureEffect } from './catalog/lightning/LightningExposureEffect';
import { LightningSurgeEffect } from './catalog/lightning/LightningSurgeEffect';
import { LightningWeaknessEffect } from './catalog/lightning/LightningWeaknessEffect';
import { LightningAuraEffect } from './catalog/lightning/LightningAuraEffect';
import { LightningWoundEffect } from './catalog/lightning/LightningWoundEffect';
import { LightningEchoEffect } from './catalog/lightning/LightningEchoEffect';
import { LightningPrisonEffect } from './catalog/lightning/LightningPrisonEffect';
import { LightningMasteryEffect } from './catalog/lightning/LightningMasteryEffect';
import { LightningCataclysmEffect } from './catalog/lightning/LightningCataclysmEffect';
import { HolyBrandEffect } from './catalog/holy/HolyBrandEffect';
import { HolyExposureEffect } from './catalog/holy/HolyExposureEffect';
import { HolySurgeEffect } from './catalog/holy/HolySurgeEffect';
import { HolyWeaknessEffect } from './catalog/holy/HolyWeaknessEffect';
import { HolyAuraEffect } from './catalog/holy/HolyAuraEffect';
import { HolyWoundEffect } from './catalog/holy/HolyWoundEffect';
import { HolyEchoEffect } from './catalog/holy/HolyEchoEffect';
import { HolyPrisonEffect } from './catalog/holy/HolyPrisonEffect';
import { HolyMasteryEffect } from './catalog/holy/HolyMasteryEffect';
import { HolyCataclysmEffect } from './catalog/holy/HolyCataclysmEffect';
import { ShadowBrandEffect } from './catalog/shadow/ShadowBrandEffect';
import { ShadowExposureEffect } from './catalog/shadow/ShadowExposureEffect';
import { ShadowSurgeEffect } from './catalog/shadow/ShadowSurgeEffect';
import { ShadowWeaknessEffect } from './catalog/shadow/ShadowWeaknessEffect';
import { ShadowAuraEffect } from './catalog/shadow/ShadowAuraEffect';
import { ShadowWoundEffect } from './catalog/shadow/ShadowWoundEffect';
import { ShadowEchoEffect } from './catalog/shadow/ShadowEchoEffect';
import { ShadowPrisonEffect } from './catalog/shadow/ShadowPrisonEffect';
import { ShadowMasteryEffect } from './catalog/shadow/ShadowMasteryEffect';
import { ShadowCataclysmEffect } from './catalog/shadow/ShadowCataclysmEffect';
import { PoisonBrandEffect } from './catalog/poison/PoisonBrandEffect';
import { PoisonExposureEffect } from './catalog/poison/PoisonExposureEffect';
import { PoisonSurgeEffect } from './catalog/poison/PoisonSurgeEffect';
import { PoisonWeaknessEffect } from './catalog/poison/PoisonWeaknessEffect';
import { PoisonAuraEffect } from './catalog/poison/PoisonAuraEffect';
import { PoisonWoundEffect } from './catalog/poison/PoisonWoundEffect';
import { PoisonEchoEffect } from './catalog/poison/PoisonEchoEffect';
import { PoisonPrisonEffect } from './catalog/poison/PoisonPrisonEffect';
import { PoisonMasteryEffect } from './catalog/poison/PoisonMasteryEffect';
import { PoisonCataclysmEffect } from './catalog/poison/PoisonCataclysmEffect';
import { ArcaneBrandEffect } from './catalog/arcane/ArcaneBrandEffect';
import { ArcaneExposureEffect } from './catalog/arcane/ArcaneExposureEffect';
import { ArcaneSurgeEffect } from './catalog/arcane/ArcaneSurgeEffect';
import { ArcaneWeaknessEffect } from './catalog/arcane/ArcaneWeaknessEffect';
import { ArcaneAuraEffect } from './catalog/arcane/ArcaneAuraEffect';
import { ArcaneWoundEffect } from './catalog/arcane/ArcaneWoundEffect';
import { ArcaneEchoEffect } from './catalog/arcane/ArcaneEchoEffect';
import { ArcanePrisonEffect } from './catalog/arcane/ArcanePrisonEffect';
import { ArcaneMasteryEffect } from './catalog/arcane/ArcaneMasteryEffect';
import { ArcaneCataclysmEffect } from './catalog/arcane/ArcaneCataclysmEffect';
import { PhysicalBrandEffect } from './catalog/physical/PhysicalBrandEffect';
import { PhysicalExposureEffect } from './catalog/physical/PhysicalExposureEffect';
import { PhysicalSurgeEffect } from './catalog/physical/PhysicalSurgeEffect';
import { PhysicalWeaknessEffect } from './catalog/physical/PhysicalWeaknessEffect';
import { PhysicalAuraEffect } from './catalog/physical/PhysicalAuraEffect';
import { PhysicalWoundEffect } from './catalog/physical/PhysicalWoundEffect';
import { PhysicalEchoEffect } from './catalog/physical/PhysicalEchoEffect';
import { PhysicalPrisonEffect } from './catalog/physical/PhysicalPrisonEffect';
import { PhysicalMasteryEffect } from './catalog/physical/PhysicalMasteryEffect';
import { PhysicalCataclysmEffect } from './catalog/physical/PhysicalCataclysmEffect';
import { CombatEffect } from '../core/types';

export function createCombatEffectCatalog(): CombatEffect[] {
  return [new FireBrandEffect(),
    new FireExposureEffect(),
    new FireSurgeEffect(),
    new FireWeaknessEffect(),
    new FireAuraEffect(),
    new FireWoundEffect(),
    new FireEchoEffect(),
    new FirePrisonEffect(),
    new FireMasteryEffect(),
    new FireCataclysmEffect(),
    new FrostBrandEffect(),
    new FrostExposureEffect(),
    new FrostSurgeEffect(),
    new FrostWeaknessEffect(),
    new FrostAuraEffect(),
    new FrostWoundEffect(),
    new FrostEchoEffect(),
    new FrostPrisonEffect(),
    new FrostMasteryEffect(),
    new FrostCataclysmEffect(),
    new LightningBrandEffect(),
    new LightningExposureEffect(),
    new LightningSurgeEffect(),
    new LightningWeaknessEffect(),
    new LightningAuraEffect(),
    new LightningWoundEffect(),
    new LightningEchoEffect(),
    new LightningPrisonEffect(),
    new LightningMasteryEffect(),
    new LightningCataclysmEffect(),
    new HolyBrandEffect(),
    new HolyExposureEffect(),
    new HolySurgeEffect(),
    new HolyWeaknessEffect(),
    new HolyAuraEffect(),
    new HolyWoundEffect(),
    new HolyEchoEffect(),
    new HolyPrisonEffect(),
    new HolyMasteryEffect(),
    new HolyCataclysmEffect(),
    new ShadowBrandEffect(),
    new ShadowExposureEffect(),
    new ShadowSurgeEffect(),
    new ShadowWeaknessEffect(),
    new ShadowAuraEffect(),
    new ShadowWoundEffect(),
    new ShadowEchoEffect(),
    new ShadowPrisonEffect(),
    new ShadowMasteryEffect(),
    new ShadowCataclysmEffect(),
    new PoisonBrandEffect(),
    new PoisonExposureEffect(),
    new PoisonSurgeEffect(),
    new PoisonWeaknessEffect(),
    new PoisonAuraEffect(),
    new PoisonWoundEffect(),
    new PoisonEchoEffect(),
    new PoisonPrisonEffect(),
    new PoisonMasteryEffect(),
    new PoisonCataclysmEffect(),
    new ArcaneBrandEffect(),
    new ArcaneExposureEffect(),
    new ArcaneSurgeEffect(),
    new ArcaneWeaknessEffect(),
    new ArcaneAuraEffect(),
    new ArcaneWoundEffect(),
    new ArcaneEchoEffect(),
    new ArcanePrisonEffect(),
    new ArcaneMasteryEffect(),
    new ArcaneCataclysmEffect(),
    new PhysicalBrandEffect(),
    new PhysicalExposureEffect(),
    new PhysicalSurgeEffect(),
    new PhysicalWeaknessEffect(),
    new PhysicalAuraEffect(),
    new PhysicalWoundEffect(),
    new PhysicalEchoEffect(),
    new PhysicalPrisonEffect(),
    new PhysicalMasteryEffect(),
    new PhysicalCataclysmEffect()];
}
