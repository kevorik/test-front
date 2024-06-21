import React from 'react'
import { Box, Pagination } from '@mui/material'

const PaginationComponent = ({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    return (
        <Box mt={2} display="flex" justifyContent="center">
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, page) => onPageChange(event, page)}
                color="primary"
            />
        </Box>
    )
}

export default PaginationComponent
