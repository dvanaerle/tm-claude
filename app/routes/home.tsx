import type { Route } from "./+types/home";

const prototypes = [
  {
    title: "Configurator",
    href: "/configurator",
  },
  {
    title: "Terrasoverkapping informatiepagina",
    href: "/productinfopage",
  },
  {
    title: "Styleguide",
    href: "/tuinmaximaal-styleguide",
  },
] as const;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tuinmaximaal prototypes" },
    { name: "description", content: "Prototype navigation" },
  ];
}

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-white text-neutral-950">
      <h1 className="border-b border-neutral-200 px-6 py-5 text-xl font-semibold">
        Tuinmaximaal Prototypes
      </h1>

      <nav aria-label="Prototype pages" className="w-full">
        <table className="w-full border-collapse">
          <tbody>
            {prototypes.map(({ href, title }) => (
              <tr key={href} className="border-b border-neutral-200">
                <td>
                  <a
                    href={href}
                    className="block w-full px-6 py-4 text-base hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none"
                  >
                    {title}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </nav>
    </main>
  );
}
