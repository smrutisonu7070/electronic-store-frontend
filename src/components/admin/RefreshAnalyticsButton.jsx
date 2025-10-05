import React from 'react';
import { Button } from 'react-bootstrap';
import { MdRefresh } from 'react-icons/md';

const RefreshAnalyticsButton = ({ onClick, loading }) => {
  return (
    <Button
      variant="outline-primary"
      className="d-flex align-items-center gap-2 mb-3"
      onClick={onClick}
      disabled={loading}
    >
      <MdRefresh className={loading ? 'spin' : ''} />
      {loading ? 'Refreshing...' : 'Refresh Analytics'}
    </Button>
  );
};

export default RefreshAnalyticsButton;