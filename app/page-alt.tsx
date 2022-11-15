"use client";

import { use, useState } from "react";
import { safeJsonFetch, isPokemonArray, isPokemon } from "../utils";
import { Pokemon } from "../_contracts";

/**
 * The main change here is to take the Query generic in the makeQueryClient and
 * to pass it down as the expected result from our query callback function. This also
 * allows us to type cast our Map correctly.
 */
function makeQueryClient<Query>() {
  const fetchMap = new Map<string, Promise<Query | undefined>>();
  return function queryClient(
    name: string,
    query: () => Promise<Query | undefined>
  ): Promise<Query | undefined> {
    if (!fetchMap.has(name)) {
      fetchMap.set(name, query());
    }
    return fetchMap.get(name)!;
  };
}

/*
 * Here we make clients for each type of request we are making.
 */
const pokemonQueryClient = makeQueryClient<Pokemon[]>();
const pokemonDetailsQueryClient = makeQueryClient<Pokemon>();

export default function Home() {
  /*
   * Here is an example of typescript now throwing an error because we haven't validated
   * our response.
   */
  const pokemonBroken = use(
    pokemonQueryClient("pokemon", async () =>
      safeJsonFetch("http://localhost:3000/api/pokemon")
    )
  );

  /**
   * Here is our type-safe and validated response.
   */
  const pokemon = use(
    pokemonQueryClient("pokemon", async () => {
      const value = await safeJsonFetch("http://localhost:3000/api/pokemon");
      if (isPokemonArray(value)) {
        return value;
      }
    })
  );

  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon>();

  const pokemonDetail = selectedPokemon
    ? use(
        pokemonDetailsQueryClient(
          ["pokemon", selectedPokemon.id].join("-"),
          () =>
            fetch(`http://localhost:3000/api/${selectedPokemon.id}`).then(
              (res) => res.json()
            )
        )
      )
    : null;

  return (
    <div>
      {pokemon?.map((p) => (
        <button key={p.id} onClick={() => setSelectedPokemon(p)}>
          {p.name}
        </button>
      ))}
      <div>{pokemonDetail && <img src={pokemonDetail.image} />}</div>
    </div>
  );
}
