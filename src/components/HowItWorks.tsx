import Reveal from './Reveal';

const STEPS = [
  { title: 'Choose your pieces', body: 'Add them to your bag and enter your delivery details.' },
  { title: 'Place your order', body: 'Your order is saved instantly with a tracking link.' },
  { title: 'Pay by transfer', body: "We confirm your order and send our bank details." },
  { title: 'Track and receive', body: 'Watch your order move from confirmed to delivered.' }
];

export default function HowItWorks() {
  return (
    <section className="py-8">
      <h2 className="mb-3.5 font-serif text-2xl font-medium">How ordering works</h2>
      <ol className="grid gap-3 md:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <li className="flex gap-3.5 rounded-xl border border-line bg-surface p-3.5 md:flex-col">
              <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-ink text-sm font-bold text-bg">
                {i + 1}
              </span>
              <span>
                <b className="block">{s.title}</b>
                {s.body}
              </span>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
