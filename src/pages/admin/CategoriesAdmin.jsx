import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../store/slices/categoriesSlice";

function CategoriesAdmin() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.categories);

  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = categoryName.trim();

    if (!name) {
      alert("Ingresá un nombre de categoría");
      return;
    }

    const result = editingCategory
      ? await dispatch(
          updateCategory({
            id: editingCategory.categoryId,
            categoryName: name,
          })
        )
      : await dispatch(createCategory(name));

    if (
      createCategory.fulfilled.match(result) ||
      updateCategory.fulfilled.match(result)
    ) {
      setCategoryName("");
      setEditingCategory(null);
      dispatch(fetchCategories());
      alert(
        editingCategory
          ? "Categoría actualizada correctamente"
          : "Categoría agregada correctamente"
      );
    } else {
      alert(result.payload || "No se pudo guardar la categoría");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setCategoryName(category.categoryName);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setCategoryName("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Desea eliminar esta categoría?")) return;

    const result = await dispatch(deleteCategory(id));

    if (deleteCategory.fulfilled.match(result)) {
      dispatch(fetchCategories());
    } else {
      alert(result.payload || "No se pudo eliminar la categoría");
    }
  };

  return (
    <section>
      <div style={{ marginBottom: "30px" }}>
        <h1>Administración de Categorías</h1>
        <p style={{ color: "#666" }}>
          Gestioná las categorías disponibles para organizar los productos.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px",
          maxWidth: "650px",
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,.08)",
        }}
      >
        <input
          type="text"
          placeholder="Nombre de la categoría"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            border: "1px solid #bbb",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "12px 18px",
            background: "#111",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {editingCategory ? "Guardar cambios" : "+ Agregar"}
        </button>

        {editingCategory && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={{
              padding: "12px 18px",
              background: "#fff",
              color: "#111",
              border: "1px solid #111",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      {loading && <p>Cargando categorías...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,.08)",
          }}
        >
          <thead>
            <tr style={{ background: "#111", color: "#fff" }}>
              <th style={{ padding: "14px", textAlign: "left" }}>ID</th>
              <th style={{ textAlign: "left" }}>Categoría</th>
              <th style={{ textAlign: "left" }}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {items.map((category) => (
              <tr
                key={category.categoryId}
                style={{ borderBottom: "1px solid #eee" }}
              >
                <td style={{ padding: "14px" }}>{category.categoryId}</td>

                <td>{category.categoryName}</td>

                <td>
                  <button
                    onClick={() => handleEdit(category)}
                    style={{
                      marginRight: "10px",
                      padding: "8px 12px",
                      border: "1px solid #111",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(category.categoryId)}
                    style={{
                      padding: "8px 12px",
                      border: "none",
                      background: "#c62828",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default CategoriesAdmin;