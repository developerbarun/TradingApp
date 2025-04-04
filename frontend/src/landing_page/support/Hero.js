import React from "react";

function Hero() {
  return (
    <section className="container-fluid" id="supportHero">
      <div className="p-5 " id="supportWrapper">
        <h4>Support Portal</h4>
        <a href="">Track Tickets</a>
      </div>
      <div className="row p-5 m-3">
        <div className="col-6 p-3">
          <h1 className="fs-3" style={{ marginLeft: "100px" }}>
            Search for an answer or browse help topics to create a ticket
          </h1>
          <input placeholder="Eg. how do I activate F&O" />
          <br />
          <a href="" style={{ marginLeft: "100px" }}>
            Track account opening
          </a>
          <a href="" style={{ marginLeft: "20px" }}>
            Track segment activation
          </a>
          <a href="" style={{ marginLeft: "20px" }}>
            Intraday margins
          </a>
          <a href="" style={{ marginLeft: "20px" }}>
            Kite user manual
          </a>
        </div>
        <div className="col-6 p-3">
          <h1
            className="fs-3"
            style={{ marginLeft: "100px", marginBottom: "15px" }}
          >
            Featured
          </h1>
          <ol>
            <li style={{ marginLeft: "120px", marginBottom: "10px" }}>
              <a href="">Current Takeovers and Delisting - January 2024</a>
            </li>
            <li style={{ marginLeft: "120px" }}>
              <a href="">Latest Intraday leverages - MIS & CO</a>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

export default Hero;
