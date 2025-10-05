import { useState } from "react"
import { Button, Card, Container, Form, FormGroup, Spinner } from "react-bootstrap"
import { toast } from "react-toastify"
import { addCategory } from "../../services/CategoryService"
import "../../styles/AdminStyles.css"

const AddCategory = () => {

    const [category, setCategory] = useState({
        title: '',
        description: '',
        coverImage: ''
    })

    const [loading, setLoading] = useState(false)
    const handleFieldChange = (event, property) => {
        event.preventDefault()
        setCategory({
            ...category,
            [property]: event.target.value
        })
    }

    const handleFormSubmit = (event) => {
        event.preventDefault()
        console.log(category);
        if (category.title === undefined || category.title.trim() === '') {
            toast.error("Category title required !!")
            return
        }

        if (category.description === undefined || category.description.trim() === '') {
            toast.error("Category Description required !!")
            return
        }

        // call server api to app category
        setLoading(true)
        addCategory(category)
            .then((data) => {
                //success
                toast.success("Category Added !")
                console.log(data)
                setCategory({
                    title: '',
                    description: '',
                    coverImage: ''
                })
            })
            .catch(error => {
                console.log(error)
                toast.error("Error in adding category !! ")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const clearForm = (event) => {
        event.preventDefault()
        setCategory({
            title: '',
            description: '',
            coverImage: ''
        })

    }

    return (
        <>
            <Container fluid className="admin-container">
                <div className="admin-form-container">
                    <Card className="admin-card">
                        <Card.Header className="admin-card-header">
                            <h4 className="admin-section-title m-0">Add New Category</h4>
                        </Card.Header>

                        <Card.Body className="admin-card-body p-4">
                            <Form onSubmit={handleFormSubmit}>
                                <FormGroup className="mb-4">
                                    <Form.Label className="admin-form-label">
                                        <i className="fas fa-tag me-2"></i>Category Title
                                    </Form.Label>
                                    <Form.Control 
                                        type="text"
                                        className="admin-form-control"
                                        placeholder="Enter a descriptive category title"
                                        onChange={(event) => handleFieldChange(event, 'title')}
                                        value={category.title}
                                    />
                                </FormGroup>

                                <FormGroup className="mb-4">
                                    <Form.Label className="admin-form-label">
                                        <i className="fas fa-align-left me-2"></i>Category Description
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        className="admin-form-control"
                                        placeholder="Write a detailed description of the category"
                                        onChange={(event) => handleFieldChange(event, 'description')}
                                        value={category.description}
                                        rows={6}
                                    />
                            </FormGroup>

                            {/* <FormGroup className="mt-3">
                                <Form.Label>Category Cover Image Url</Form.Label>
                                <Form.Control type="text"
                                    placeholder="Enter here"
                                    onChange={(event) => handleFieldChange(event, 'coverImage')}
                                    value={category.coverImage}
                                />
                            </FormGroup> */}

                            <div className="admin-button-group">
                                <Button 
                                    type="submit" 
                                    className="admin-button admin-button-primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner
                                                variant={'border'}
                                                size={'sm'}
                                                className='me-2'
                                            />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-plus-circle"></i>
                                            <span>Add Category</span>
                                        </>
                                    )}
                                </Button>
                                <Button 
                                    onClick={clearForm} 
                                    className="admin-button admin-button-secondary"
                                >
                                    <i className="fas fa-undo"></i>
                                    <span>Reset Form</span>
                                </Button>
                            </div>

                        </Form>

                    </Card.Body>
                </Card>
                </div>
            </Container>
        </>
    )
}

export default AddCategory