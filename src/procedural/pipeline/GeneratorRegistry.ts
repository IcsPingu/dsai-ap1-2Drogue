import { MapGenerator, GeneratorAlgorithm } from '../core/types';
import { BspDungeonGenerator } from '../algorithms/BspDungeonGenerator';
import { CellularAutomataGenerator } from '../algorithms/CellularAutomataGenerator';
import { DrunkardWalkGenerator } from '../algorithms/DrunkardWalkGenerator';
import { GrammarDungeonGenerator } from '../algorithms/GrammarDungeonGenerator';
import { HybridDungeonGenerator } from '../algorithms/HybridDungeonGenerator';
import { DepthFirstMazeGenerator, EllerMazeGenerator, KruskalMazeGenerator, PrimMazeGenerator } from '../algorithms/MazeGenerators';
import { RoomGraphGenerator } from '../algorithms/RoomGraphGenerator';
import { VoronoiCaveGenerator } from '../algorithms/VoronoiCaveGenerator';
import { WaveFunctionCollapseGenerator } from '../algorithms/WaveFunctionCollapseGenerator';

export class GeneratorRegistry {
  private readonly generators = new Map<GeneratorAlgorithm, MapGenerator>();

  public constructor(registerDefaults = true) {
    if (registerDefaults) {
      this.register(new BspDungeonGenerator());
      this.register(new DrunkardWalkGenerator());
      this.register(new CellularAutomataGenerator());
      this.register(new DepthFirstMazeGenerator());
      this.register(new PrimMazeGenerator());
      this.register(new KruskalMazeGenerator());
      this.register(new EllerMazeGenerator());
      this.register(new RoomGraphGenerator());
      this.register(new WaveFunctionCollapseGenerator());
      this.register(new GrammarDungeonGenerator());
      this.register(new VoronoiCaveGenerator());
      this.register(new HybridDungeonGenerator());
    }
  }

  public register(generator: MapGenerator, replace = false): this {
    if (this.generators.has(generator.algorithm) && !replace) throw new Error('generator already registered: ' + generator.algorithm);
    this.generators.set(generator.algorithm, generator);
    return this;
  }

  public unregister(algorithm: GeneratorAlgorithm): boolean {
    return this.generators.delete(algorithm);
  }

  public get(algorithm: GeneratorAlgorithm): MapGenerator {
    const generator = this.generators.get(algorithm);
    if (!generator) throw new Error('unknown procedural generator: ' + algorithm);
    return generator;
  }

  public has(algorithm: GeneratorAlgorithm): boolean {
    return this.generators.has(algorithm);
  }

  public list(): GeneratorAlgorithm[] {
    return [...this.generators.keys()];
  }

  public get size(): number {
    return this.generators.size;
  }
}
