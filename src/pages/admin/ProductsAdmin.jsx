import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProductTable from "../../components/admin/ProductTable";
import ProductModal from "../../components/admin/ProductModal";
import ProductForm from "../../components/admin/ProductForm";

import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "../../store/slices/productsSlice";

import { fetchBrands } from "../../store/slices/brandsSlice";
import { fetchCategories } from "../../store/slices/categoriesSlice";

function ProductsAdmin() {
  const dispatch = useDispatch();

  const { items: products, loading, error } = useSelector(
    (state) => state.products
  );

  const { items: brands } = useSelector((state) => state.brands);
  const { items: categories } = useSelector((state) => state.categories);

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchBrands());
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredProducts = products.filter((product) => {
    const text = search.toLowerCase();

    return (
      product.model?.toLowerCase().includes(text) ||
      product.description?.toLowerCase().includes(text) ||
      product.brand?.brandName?.toLowerCase().includes(text) ||
      product.category?.categoryName?.toLowerCase().includes(text)
    );
  });

  const handleNewProduct = () => {
    setEditingProduct(null);
    setOpenModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Desea eliminar este producto?")) return;

    await dispatch(deleteProduct(id));
    dispatch(fetchProducts());
  };

  const handleSave = async ({ product, imageFile }) => {
    let productId;

    if (editingProduct) {
      const result = await dispatch(
        updateProduct({
          id: editingProduct.productId,
          product,
        })
      );

      if (!updateProduct.fulfilled.match(result)) {
        alert(result.payload || "No se pudo actualizar el producto");
        return;
      }

      productId = editingProduct.productId;
    } else {
      const result = await dispatch(createProduct(product));

      if (!createProduct.fulfilled.match(result)) {
        alert(result.payload || "No se pudo crear el producto");
        return;
      }

      productId = result.payload.productId;
    }

    if (imageFile && productId) {
      const imageResult = await dispatch(
        uploadProductImage({
          productId,
          file: imageFile,
        })
      );

      if (!uploadProductImage.fulfilled.match(imageResult)) {
        alert(imageResult.payload || "El producto se guardó, pero no se pudo subir la imagen");
      }
    }

    setOpenModal(false);
    setEditingProduct(null);

    dispatch(fetchProducts());
  };

  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h1>Administración de Productos</h1>

        <button
          onClick={handleNewProduct}
          style={{
            padding: "12px 18px",
            background: "#111",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          + Nuevo Producto
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "12px",
          marginBottom: "25px",
        }}
      />

      {loading && <p>Cargando productos...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && (
        <ProductTable
          products={filteredProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <ProductModal
        open={openModal}
        title={editingProduct ? "Editar Producto" : "Nuevo Producto"}
        onClose={() => {
          setOpenModal(false);
          setEditingProduct(null);
        }}
      >
        <ProductForm
          product={editingProduct}
          brands={brands}
          categories={categories}
          onSave={handleSave}
          onCancel={() => {
            setOpenModal(false);
            setEditingProduct(null);
          }}
        />
      </ProductModal>
    </section>
  );
}

export default ProductsAdmin;