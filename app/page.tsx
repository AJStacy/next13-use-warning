"use client";

import { use, useState } from "react";

type Pokemon = { id: number; name: string; image?: string };

// !!! Look at page-alt.tsx for my version. !!!

// ----------- Original Code -------------- //
function makeQueryClient() {
  const fetchMap = new Map<
    string,
    Promise<any>
  >(); /* <- Never use any. `unknown` is preferred
  because it behaves the same as any with the caveat that it will not let you reassign the value
  until it has been properly type casted. In this case though we would want this map to contain
  specific values. */
  return function queryClient<QueryResult>(
    name: string,
    query: () => Promise<QueryResult>
  ): Promise<QueryResult> {
    if (!fetchMap.has(name)) {
      fetchMap.set(name, query());
    }
    return fetchMap.get(name)!;
  };
}

const queryClient =
  makeQueryClient(); /* <- There is nothing wrong with creating a queryClient per
type of query much like you would have multiple useEffect and useState hooks within a component. */

export default function Home() {
  // ------- original version --------
  const pokemon = use(
    queryClient(
      "pokemon",
      () =>
        fetch("http://localhost:3000/api/pokemon").then((res) =>
          res.json()
        ) as Promise<
          Pokemon[]
        > /* <- The problem here is that by coercing the value you are
        assuming that the value returned by the API will be Pokemon[]. While it may be initially
        safe, any future changes to the API would introduce a bug. The value returned by the Promise
        might in fact be a value that does not match Pokemon[] (especially if this is an API
        that you do not own). Your app would now break. For this reason, there are very few cases 
        where you should ever coerce a value. */
    )
  );

  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon>();

  const pokemonDetail = selectedPokemon
    ? use(
        queryClient(
          ["pokemon", selectedPokemon.id].join("-"),
          () =>
            fetch(`http://localhost:3000/api/${selectedPokemon.id}`).then(
              (res) => res.json()
            ) as Promise<Pokemon>
        )
      )
    : null;

  return (
    <div>
      {pokemon.map((p) => (
        <button key={p.id} onClick={() => setSelectedPokemon(p)}>
          {p.name}
        </button>
      ))}
      <div>{pokemonDetail && <img src={pokemonDetail.image} />}</div>
    </div>
  );
}
