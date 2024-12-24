import React from "react";

function Dashboard() {
    return (
        <div>
            {/* Top widgets */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6>
                                <i className="bi bi-currency-dollar me-2 text-success"></i>Total Income
                            </h6>
                            <h4 className="text-primary">$14,025</h4>
                            <p className="text-muted">This year</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6>
                                <i className="bi bi-graph-up-arrow me-2 text-info"></i>Sessions
                            </h6>
                            <h4 className="text-primary">2025</h4>
                            <p className="text-muted">This month</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6>
                                <i className="bi bi-wallet-fill me-2 text-warning"></i>Ethereum Wallet
                            </h6>
                            <h4 className="text-primary">8025</h4>
                            <p className="text-muted">This month</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6>
                                <i className="bi bi-people-fill me-2 text-danger"></i>Number of Clients
                            </h6>
                            <h4 className="text-primary">5645</h4>
                            <p className="text-muted">This month</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
