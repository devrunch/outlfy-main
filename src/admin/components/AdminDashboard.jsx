"use client";
import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { authUtils } from "@/lib/authUtils";
import Link from "next/link";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    caseStudies: 0,
    formSubmissions: 0,
    pendingResponses: 0,
    featuredProjects: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch case studies
      const caseStudiesRes = await authUtils.authenticatedFetch('/api/admin/case-studies');
      const caseStudiesData = await caseStudiesRes.json();
      
      // Fetch form responses
      const formResponsesRes = await authUtils.authenticatedFetch('/api/admin/form-responses?limit=5');
      const formResponsesData = await formResponsesRes.json();
      
      setStats({
        caseStudies: Array.isArray(caseStudiesData) ? caseStudiesData.length : 0,
        formSubmissions: formResponsesData.pagination ? formResponsesData.pagination.total : 0,
        pendingResponses: formResponsesData.responses ? formResponsesData.responses.filter(r => r.status === 'new').length : 0,
        featuredProjects: Array.isArray(caseStudiesData) ? caseStudiesData.filter(cs => cs.featured).length : 0
      });
      
      setRecentSubmissions(formResponsesData.responses || []);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: "Total Case Studies",
      value: stats.caseStudies,
      icon: "fas fa-briefcase",
      color: "primary",
      change: "Active projects"
    },
    {
      title: "Form Submissions",
      value: stats.formSubmissions,
      icon: "fas fa-envelope",
      color: "success",
      change: "Total received"
    },
    {
      title: "Pending Responses",
      value: stats.pendingResponses,
      icon: "fas fa-clock",
      color: "warning",
      change: "Needs attention"
    },
    {
      title: "Featured Projects",
      value: stats.featuredProjects,
      icon: "fas fa-star",
      color: "info",
      change: "Active showcase"
    }
  ];

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="fas fa-tachometer-alt me-3"></i>
          Admin Dashboard
        </h1>
        <div className="text-muted">
          <i className="fas fa-calendar me-1"></i>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        {statsData.map((stat, index) => (
          <Col md={6} lg={3} key={index} className="mb-3">
            <div className="stat-card">
              <div className={`stat-icon ${stat.color}`}>
                <i className={stat.icon}></i>
              </div>
              <h3 className="stat-number">
                {loading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  stat.value
                )}
              </h3>
              <p className="stat-label">{stat.title}</p>
              <small className="text-muted">{stat.change}</small>
            </div>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <div className="admin-card">
            <div className="card-header">
              <h5>
                <i className="fas fa-bolt me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex gap-3 flex-wrap">
                <Link href="/admin/case-studies/new" className="btn btn-primary">
                  <i className="fas fa-plus me-2"></i>
                  New Case Study
                </Link>
                <Link href="/admin/case-studies" className="btn btn-outline-primary">
                  <i className="fas fa-briefcase me-2"></i>
                  Manage Case Studies
                </Link>
                <Link href="/admin/form-responses" className="btn btn-outline-success">
                  <i className="fas fa-envelope me-2"></i>
                  View Form Responses
                </Link>
                <Button variant="outline-info" onClick={fetchDashboardData}>
                  <i className="fas fa-sync-alt me-2"></i>
                  Refresh Data
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Recent Submissions */}
        <Col lg={8} className="mb-4">
          <div className="admin-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>
                <i className="fas fa-inbox me-2"></i>
                Recent Form Submissions
              </h5>
              <Link href="/admin/form-responses" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="list-group list-group-flush">
              {loading ? (
                <div className="list-group-item text-center py-4">
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Loading submissions...
                </div>
              ) : recentSubmissions.length > 0 ? (
                recentSubmissions.slice(0, 5).map((submission, index) => (
                  <div key={index} className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{submission.name}</div>
                      <small className="text-muted">{submission.email}</small>
                      <div className="mt-1">
                        <span className="badge bg-primary rounded-pill">{submission.subject}</span>
                        <span className={`badge ms-2 rounded-pill ${
                          submission.status === 'new' ? 'bg-warning' :
                          submission.status === 'replied' ? 'bg-success' : 'bg-secondary'
                        }`}>
                          {submission.status}
                        </span>
                      </div>
                    </div>
                    <small className="text-muted">
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                ))
              ) : (
                <div className="list-group-item text-center py-4 text-muted">
                  No form submissions yet
                </div>
              )}
            </div>
            <div className="card-footer text-center">
              <a href="/admin/responses" className="btn btn-outline-primary btn-sm">
                <i className="fas fa-eye me-1"></i>
                View All Responses
              </a>
            </div>
          </div>
        </Col>

        {/* Quick Actions */}
        <Col lg={4} className="mb-4">
          <div className="admin-card">
            <div className="card-header">
              <h5>
                <i className="fas fa-bolt me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div className="d-grid gap-2">
              <a href="/admin/case-studies" className="btn btn-primary">
                <i className="fas fa-plus me-2"></i>
                Add New Case Study
              </a>
              <a href="/admin/responses" className="btn btn-outline-primary">
                <i className="fas fa-envelope me-2"></i>
                View Responses
              </a>
              <a href="/admin/case-studies" className="btn btn-outline-secondary">
                <i className="fas fa-edit me-2"></i>
                Manage Case Studies
              </a>
            </div>
          </div>

          {/* System Info */}
          <div className="admin-card mt-3">
            <div className="card-header">
              <h5>
                <i className="fas fa-info-circle me-2"></i>
                System Info
              </h5>
            </div>
            <div className="small">
              <div className="d-flex justify-content-between mb-2">
                <span>Version:</span>
                <span className="text-muted">v1.0.0</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Last Backup:</span>
                <span className="text-muted">Today, 3:00 AM</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Database Status:</span>
                <span className="text-success">
                  <i className="fas fa-circle me-1"></i>
                  Connected
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Server Status:</span>
                <span className="text-success">
                  <i className="fas fa-circle me-1"></i>
                  Online
                </span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
