import { Button, Modal, Badge, OverlayTrigger, Tooltip } from "react-bootstrap"
import { MdDelete } from 'react-icons/md'
import { GrFormView } from 'react-icons/gr'
import { BsFillPencilFill } from 'react-icons/bs'
import { BiPackage } from 'react-icons/bi'
import Swal from "sweetalert2"
import { toast } from "react-toastify"
import { deleteProduct } from "../../services/product.service"
import { useState } from "react"
const SingleProductView = ({
    index,
    product,
    updateProductList,
    openProductViewModal,
    openEditProductModel
}) => {



    const formatDate = (time) => {
        return new Date(time).toLocaleDateString()
    }

    const getBackgroundForProduct = () => {
        //live +stock===> green: table-success

        //not live: ==>red: table-danger

        //not stock==>yellow: table-warn
        if (product.live && product.stock) {
            return "table-success"
        } else if (!product.live) {
            return "table-danger"
        } else if (!product.stock) {
            return "table-warning"
        } else {

        }
    }

    // Quick stock update
    const handleQuickStockUpdate = (product) => {
        Swal.fire({
            title: 'Update Stock',
            html: `
                <div class="form-group">
                    <label>Current Stock: ${product.quantity}</label>
                    <input 
                        type="number" 
                        id="stockQuantity" 
                        class="form-control mt-2" 
                        value="${product.quantity}"
                        min="0"
                    >
                    <div class="mt-3">
                        <label>Operation:</label>
                        <select id="stockOperation" class="form-control">
                            <option value="set">Set to</option>
                            <option value="add">Add</option>
                            <option value="remove">Remove</option>
                        </select>
                    </div>
                    <div class="text-muted mt-2 small">
                        Low stock threshold: ${product.lowStockThreshold || 10}<br>
                        Reorder point: ${product.reorderPoint || 20}
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Update',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const newQuantity = parseInt(document.getElementById('stockQuantity').value);
                const operation = document.getElementById('stockOperation').value;
                let quantity;
                
                switch(operation) {
                    case 'set':
                        quantity = newQuantity - product.quantity; // Calculate difference
                        break;
                    case 'add':
                        quantity = newQuantity;
                        break;
                    case 'remove':
                        quantity = -newQuantity;
                        break;
                }
                
                return fetch(`/inventory/product/${product.productId}/stock?quantity=${quantity}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText)
                    }
                    return response.json()
                })
                .catch(error => {
                    Swal.showValidationMessage(
                        `Request failed: ${error}`
                    )
                })
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                toast.success('Stock updated successfully');
                // Update product list to reflect changes
                updateProductList(product.productId);
            }
        })
    }

    //deleteProduct
    const deleteProductLocal = (productId) => {

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                //call api 

                deleteProduct(product.productId).then(data => {
                    console.log(data);
                    toast.success("product Deleted")

                    updateProductList(productId)

                })
                    .catch(error => {
                        console.log(error)
                        toast.error("Error in deleting product")
                    })



            }
        })
    }



    return (
        <tr className={getBackgroundForProduct()}>
            <td className="px-3 small"> {index + 1}</td>
            <td className="px-3 small" >{product.title}</td>
            <td className="px-3 small">
                <Badge bg={product.quantity > 10 ? 'success' : product.quantity > 0 ? 'warning' : 'danger'}>
                    {product.quantity}
                </Badge>
                {product.quantity <= 5 && product.quantity > 0 && (
                    <Badge bg="warning" className="ms-2">Low Stock</Badge>
                )}
                {product.quantity === 0 && (
                    <Badge bg="danger" className="ms-2">Out of Stock</Badge>
                )}
            </td>
            <td className="px-3 small">{product.price}₹</td>
            <td className="px-3 small">{product.discountedPrice}₹</td>
            <td className={`px-3 small `}>
                <Badge bg={product.live ? 'success' : 'danger'}>
                    {product.live ? 'Active' : 'Inactive'}
                </Badge>
            </td>
            <td className="px-3 small">
                <Badge bg={product.stock ? 'success' : 'danger'}>
                    {product.stock ? 'In Stock' : 'Out of Stock'}
                </Badge>
            </td>
            <td className="px-3 small" >{product.category ? product.category.title : ' '}</td>
            <td className="px-3 small">{formatDate(product.addedDate)} </td>
            <td className={`px-3 small d-flex table-light `}>
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Quick Stock Update</Tooltip>}
                >
                    <Button className="me-2" variant="info" onClick={(event) => handleQuickStockUpdate(product)} size="sm">
                        <BiPackage />
                    </Button>
                </OverlayTrigger>

                <Button variant="danger" onClick={(event) => deleteProductLocal(product.productId)} size="sm">
                    <MdDelete />
                </Button>

                <Button className="ms-2" onClick={(event) => openProductViewModal(event, product)} variant="warning" size="sm">
                    <GrFormView />
                </Button>

                <Button onClick={(event) => openEditProductModel(event, product)} className="ms-2" variant="dark" size="sm">
                    <BsFillPencilFill />
                </Button>
            </td>

        </tr>


    )
}

export default SingleProductView