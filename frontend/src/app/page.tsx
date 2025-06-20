import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-white p-6">
      {/* Logo */}
      <div className="text-center mb-10">
        <Image
          src="/logo.png"
          alt="Logo DiaCare"
          width={100}
          height={100}
          className="mx-auto mb-4"
        />
        <h2 className="text-xl text-gray-600">
          Suivi intelligent pour une dialyse efficace
        </h2>
      </div>

      {/* Boutons d'accès */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl text-center">
        <AccessButton
          role="Patient"
          href="/patient/login"
          color="from-blue-400 to-blue-600"
        />
        <AccessButton
          role="Technicien"
          href="/technicien/login"
          color="from-green-400 to-green-600"
        />
        <AccessButton
          role="Administrateur"
          href="/admin/login"
          color="from-gray-400 to-gray-600"
        />
      </div>
    </main>
  );
}

function AccessButton({
  role,
  href,
  color,
}: {
  role: string;
  href: string;
  color: string;
}) {
  return (
    <a
      href={href}
      className={`bg-gradient-to-r ${color} text-white font-semibold rounded-xl p-6 shadow-lg hover:scale-105 transition duration-300 ease-in-out`}
    >
      <h3 className="text-2xl mb-2">Accès {role}</h3>
      <p className="text-sm opacity-90">Cliquez pour vous connecter</p>
    </a>
  );
}
