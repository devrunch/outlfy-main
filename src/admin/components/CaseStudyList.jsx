"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Form, InputGroup, Alert } from "react-bootstrap";
import { authUtils } from "@/lib/authUtils";

const CaseStudyList = ({ onSelect, onDelete, refreshTrigger }) => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchCaseStudies();
  }, [refreshTrigger]);

  const fetchCaseStudies = async () => {
    setLoading(true);
    try {
      const response = await authUtils.authenticatedFetch('/api/admin/case-studies');
      if (response.ok) {
        const data = await response.json();
        setCaseStudies(data || []);
      } else {
        throw new Error('Failed to fetch case studies');
      }
    } catch (error) {
      console.error('Error loading case studies:', error);
      setMessage({ type: "danger", text: "Error loading case studies" });
      setCaseStudies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this case study?")) {
      try {
        const response = await authUtils.authenticatedFetch(`/api/admin/case-studies/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setCaseStudies(prev => prev.filter(cs => cs._id !== id));
          setMessage({ type: "success", text: "Case study deleted successfully" });
          if (onDelete) onDelete();
        } else {
          throw new Error('Failed to delete case study');
        }
      } catch (error) {
        console.error('Error deleting case study:', error);
        setMessage({ type: "danger", text: "Error deleting case study" });
      }
    }
  };

  const togglePublishStatus = async (id) => {
    try {
      const caseStudy = caseStudies.find(cs => cs._id === id);
      const updatedStatus = caseStudy.status === "published" ? "draft" : "published";

      const response = await authUtils.authenticatedFetch(`/api/admin/case-studies/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...caseStudy,
          status: updatedStatus
        }),
      });

      if (response.ok) {
        setCaseStudies(prev =>
          prev.map(cs =>
            cs._id === id ? { ...cs, status: updatedStatus } : cs
          )
        );
        setMessage({ type: "success", text: `Case study status updated to ${updatedStatus}` });
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage({ type: "danger", text: "Error updating status" });
    }
  };

  const toggleStatus = async (id, field) => {
    try {
      const caseStudy = caseStudies.find(cs => cs._id === id);
      const updatedValue = !caseStudy[field];
      
      const response = await authUtils.authenticatedFetch(`/api/admin/case-studies/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...caseStudy,
          [field]: updatedValue
        }),
      });
      
      if (response.ok) {
        setCaseStudies(prev => 
          prev.map(cs => 
            cs._id === id ? { ...cs, [field]: updatedValue } : cs
          )
        );
        setMessage({ type: "success", text: `Case study ${field} updated` });
      } else {
        throw new Error(`Failed to update ${field}`);
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      setMessage({ type: "danger", text: `Error updating ${field}` });
    }
  };

  const filteredCaseStudies = caseStudies.filter(cs => {
    const matchesSearch = (cs.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (cs.clientName || cs.client || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (cs.industry || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" ||
                         (filterStatus === "published" && cs.status === "published") ||
                         (filterStatus === "draft" && cs.status !== "published") ||
                         (filterStatus === "featured" && cs.featured);
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-card">
      <div className="card-header">
        <h5>
          <i className="fas fa-briefcase me-2"></i>
          Case Studies ({filteredCaseStudies.length})
        </h5>
      </div>

      {message.text && (
        <Alert variant={message.type} className="mb-3" dismissible onClose={() => setMessage({ type: "", text: "" })}>
          {message.text}
        </Alert>
      )}

      {/* Search and Filter */}
      <div className="row mb-3">
        <div className="col-md-8">
          <InputGroup>
            <InputGroup.Text>
              <i className="fas fa-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by title, client, or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>
        <div className="col-md-4">
          <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Case Studies</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="featured">Featured</option>
          </Form.Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <i className="fas fa-spinner fa-spin fa-2x text-primary"></i>
          <p className="mt-2">Loading case studies...</p>
        </div>
      ) : (
        <Table responsive className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Client</th>
              <th>Industry</th>
              <th>Type</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCaseStudies.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <i className="fas fa-folder-open fa-2x text-muted mb-2 d-block"></i>
                  No case studies found
                </td>
              </tr>
            ) : (
              filteredCaseStudies.map((cs) => (
                <tr key={cs._id}>
                  <td>
                    <div>
                      <strong>{cs.title || 'Untitled'}</strong>
                      <br />
                      <small className="text-muted">/{cs.slug || 'no-slug'}</small>
                    </div>
                  </td>
                  <td>{cs.clientName || cs.client || 'N/A'}</td>
                  <td>{cs.industry || 'N/A'}</td>
                  <td>
                    <Badge bg="info" className="rounded-pill">
                      {cs.projectType || 'General'}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex flex-column gap-1">
                      <Badge
                        bg={cs.status === "published" ? "success" : "secondary"}
                        className="rounded-pill cursor-pointer"
                        onClick={() => togglePublishStatus(cs._id)}
                        style={{ cursor: "pointer" }}
                      >
                        {cs.status === "published" ? "Published" : "Draft"}
                      </Badge>
                      {cs.featured && (
                        <Badge 
                          bg="warning" 
                          className="rounded-pill cursor-pointer"
                          onClick={() => toggleStatus(cs._id, "featured")}
                          style={{ cursor: "pointer" }}
                        >
                          Featured
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(cs.createdAt)}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => onSelect(cs)}
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-success"
                        onClick={() => window.open(`/case-studies/${cs.slug || cs._id}`, '_blank')}
                        title="View"
                        disabled={!cs.slug && !cs._id}
                      >
                        <i className="fas fa-eye"></i>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(cs._id)}
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default CaseStudyList;
