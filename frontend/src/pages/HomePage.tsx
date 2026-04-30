import { Link } from "react-router-dom";
import type { CSSProperties } from "react";

const styles: Record<string, CSSProperties> = {
  wrap: {
    margin: "8px",
  },
  top: {
    marginBottom: "14px",
    marginLeft: "2px",
  },
  title: {
    margin: 0,
    fontSize: "25px",
    color: "#273243",
  },
  sub: {
    marginTop: "6px",
    marginLeft: "1px",
    color: "#556275",
    fontSize: "13px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },
  box: {
    background: "#fff",
  },
  adminBox: {
    padding: "17px 24px 13px 14px",
  },
  employeeBox: {
    padding: "20px 13px 17px 19px",
    background: "#f2fcf7",
  },
  h2: {
    margin: "0 0 8px 0",
    textTransform: "uppercase",
    fontSize: "12px",
    letterSpacing: "0.6px",
    color: "#67748a",
  },
  h2Emp: {
    color: "#246142",
    marginBottom: "12px",
  },
  list: {
    marginTop: 0,
    marginBottom: "15px",
    paddingLeft: "22px",
  },
  listEmp: {
    marginBottom: "10px",
    paddingLeft: "20px",
  },
  row: {
    display: "flex",
    gap: "7px",
  },
  card: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    textDecoration: "none",
    color: "#263446",
    padding: "10px 8px 10px 11px",
    background: "white",
  },
  cardUneven: {
    padding: "13px 11px 9px 9px",
  },
  cardEmp: {
    marginTop: "4px",
    padding: "11px 11px 13px 14px",
  },
  cardText: {
    marginRight: "6px",
  },
  h3: {
    margin: 0,
    fontSize: "16px",
  },
  p: {
    margin: "3px 0 0 0",
    color: "#5d6a7e",
    fontSize: "13px",
  },
  arrow: {
    color: "#5b6678",
  },
};

const HomePage = () => {
  return (
    <div style={styles.wrap}>
      <div style={styles.top}>
        <h1 style={styles.title}>Performence</h1>
        <p style={styles.sub}> reviws  feedbak.</p>
      </div>

      <div style={styles.grid}>
        <section style={{ ...styles.box, ...styles.adminBox }}>
          <h2 style={styles.h2}>For adminstrators</h2>
          
          <div style={styles.row}>
            <Link to="/admin/employees"  >
              <div style={styles.cardText}>
                <h3 style={styles.h3}>Employees</h3>
                <p style={styles.p}>View, add, edit, remove and promote.</p>
              </div>
              <span style={styles.arrow}>{">>"}</span>
            </Link>
            <Link to="/admin/reviews"  >
              <div style={styles.cardText}>
                <h3 style={styles.h3}>Reviews</h3>
                <p style={styles.p}>Create, assign, close and check feedback.</p>
              </div>
              <span style={styles.arrow}>{">>"}</span>
            </Link>
          </div>
        </section>

        <section style={{ ...styles.box, ...styles.employeeBox }}>
          <h2 style={{ ...styles.h2, ...styles.h2Emp }}>For employees</h2>
          
          <Link to="/employee" >
            <div style={styles.cardText}>
              <h3 style={styles.h3}>My feedback</h3>
              <p style={styles.p}>Pending reviws and your old submisions.</p>
            </div>
            <span style={styles.arrow}>{">>"}</span>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
