import Link from "next/link";

const Career1 = () => {
  return (
    <>
      <section className="job__area pt-130 pb-150" id="job_list">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12">
              <div className="sec-title-wrapper">
                <h2 className="sec-title title-anim">
                  We’re Currently <br />
                  hiring
                </h2>
              </div>
            </div>
            <div className="col-xxl-12">
              <div className="job__list">
                <Link href="/career/internship">
                  <div className="job__item">
                    <p className="job__no">01</p>
                    <h3 className="job__title">Outlfy Internship Program</h3>
                    <h4 className="job__open">(90-day Remote Leadership Track)</h4>
                    <div className="job__link">
                      <span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Career1;
