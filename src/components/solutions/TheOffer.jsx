const values = [
  "You pay for results, not hours.",
  "We build only what your business needs and can afford.",
  "You own every system we build.",
  "If we do not create value, you do not pay.",
];

const TheOffer = () => {
  return (
    <section className="offer__area">
      <div className="container g-0 line pt-140 pb-140">
        <span className="line-3"></span>

        <div className="row">
          <div className="col-12">
            <div className="offer__head">
              <span className="offer__eyebrow">Our 5-step growth system</span>
              <h2 className="offer__title title-anim">
                How we build systems that scale
              </h2>
            </div>
          </div>
        </div>

        <div className="row offer__body-row">
          <div className="col-xxl-4 col-xl-4 col-lg-4">
            <div className="offer__cta-col">
              <div className="btn_wrapper">
                <a
                  href="mailto:info@outlfy.com?subject=Book%20the%20conversation"
                  className="wc-btn-primary btn-hover btn-item"
                >
                  <span></span>
                  Start Your <br /> Audit{" "}
                  <i className="fa-solid fa-arrow-up-right"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-xxl-8 col-xl-8 col-lg-8">
            <div className="offer__details">
              <p className="offer__intro">
                For one week, we work inside your business to find where
                time, money, and opportunities are being lost. Then we show
                you a simple plan: what to fix, what it is worth, and what it
                will take.
              </p>

              <ul className="offer__values">
                {values.map((value) => (
                  <li key={value}>
                    <span className="offer__plus" aria-hidden="true">
                      +
                    </span>
                    {value}
                  </li>
                ))}
              </ul>

              <p className="offer__closer">
                No upfront risk. Just clarity — and a better way to run your
                business.
              </p>
              <p className="offer__note">
                We take on only a few businesses each month, so every client
                gets our full attention.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheOffer;
