export default function HomeFold() {
  return (
    <section>
      <div className="flex flex-col flex-grow justify-center gap-[1rem]">
        <div className="flex flex-col justify-center items-start gap-[0.5rem]">
          <p>Tel. No. 222-1965</p>
          <h1>
            Dr. Juliet Coching <em>OB/GYN</em> Clinic<em>.</em>
          </h1>
          <div className="flex gap-[0.5rem]">
            <div className="flex justify-center items-center py-[0.5rem] px-[1.5rem] rounded-full bg-accent text-white">
              <p>Sonologist</p>
            </div>
            <div className="flex justify-center items-center py-[0.5rem] px-[1.5rem] rounded-full bg-accent text-white">
              <p>HRP Specialist</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-start border-border border rounded-md p-[1rem] w-fit">
          <h2>
            Clinic Hours<em>.</em>
          </h2>
          <p>
            Mon. - Fri. 9:00 - 16:00 <em className="text-border">|</em> Sat.
            9:00 - 13:00
          </p>
        </div>
      </div>
    </section>
  );
}
