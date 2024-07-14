import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
} from '@mui/material'
import Button from '../Atoms/Button'

const SchoolTable = ({
    schools,
    sortColumn,
    sortDirection,
    onSort,
    onEdit,
    onDelete,
}) => (
    <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell
                        sortDirection={
                            sortColumn === 'name' ? sortDirection : false
                        }
                    >
                        <TableSortLabel
                            active={sortColumn === 'name'}
                            direction={
                                sortColumn === 'name' ? sortDirection : 'asc'
                            }
                            onClick={() => onSort('name')}
                        >
                            Name
                        </TableSortLabel>
                    </TableCell>
                    <TableCell
                        sortDirection={
                            sortColumn === 'address' ? sortDirection : false
                        }
                    >
                        <TableSortLabel
                            active={sortColumn === 'address'}
                            direction={
                                sortColumn === 'address' ? sortDirection : 'asc'
                            }
                            onClick={() => onSort('address')}
                        >
                            Address
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {schools.map((school) => (
                    <TableRow key={school.id}>
                        <TableCell>{school.id}</TableCell>
                        <TableCell>{school.name}</TableCell>
                        <TableCell>{school.address}</TableCell>
                        <TableCell>{school.isActive ? 'Yes' : 'No'}</TableCell>
                        <TableCell>
                            {school.foundedDate
                                ? new Date(
                                      school.foundedDate
                                  ).toLocaleDateString()
                                : ''}
                        </TableCell>
                        <TableCell>
                            {school.level ? school.level.name : ''}
                        </TableCell>
                        <TableCell>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => onDelete(school.id)}
                                style={{ marginRight: '10px' }}
                            >
                                Delete
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => onEdit(school)}
                            >
                                Edit
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
)

export default SchoolTable
