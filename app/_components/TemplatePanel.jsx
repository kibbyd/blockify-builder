"use client";
import React, { useState, useMemo } from "react";
import {
  Search, LayoutTemplate,
  Sparkles, Star, MessageSquareQuote, Megaphone,
  DollarSign, AlignLeft, Footprints, HelpCircle,
  Tag, ShieldCheck, ShoppingBag, ImageIcon,
} from "lucide-react";
import {
  sectionTemplates,
  subcategories,
} from "@/app/_config/templates";
import { instantiateTemplate } from "@/app/_utils/templateUtils";

const subcategoryIcons = {
  promo: Tag,
  hero: Sparkles,
  trust: ShieldCheck,
  product: ShoppingBag,
  features: Star,
  content: AlignLeft,
  testimonials: MessageSquareQuote,
  gallery: ImageIcon,
  cta: Megaphone,
  pricing: DollarSign,
  faq: HelpCircle,
  footer: Footprints,
};

const TemplatePanel = ({ onInsertElements }) => {
  const [search, setSearch] = useState("");
  const [activeSubcategory, setActiveSubcategory] = useState(null);

  const filteredSections = useMemo(() => {
    let list = sectionTemplates;
    if (activeSubcategory) {
      list = list.filter((t) => t.subcategory === activeSubcategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.subcategory.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeSubcategory, search]);

  const handleInsertSection = (template) => {
    const elements = instantiateTemplate(template);
    onInsertElements(elements);
  };

  return (
    <div className="template-panel" data-id="template-panel--container--root">
      <div className="template-panel-header">
        <div className="template-search">
          <Search size={14} className="template-search-icon" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-id="template-panel--input--search"
          />
        </div>
      </div>

      <div className="template-panel-body">
          <>
            <div className="template-subcategories">
              <button
                className={`template-subcategory ${activeSubcategory === null ? "active" : ""}`}
                onClick={() => setActiveSubcategory(null)}
                data-id="template-panel--filter--all"
              >
                All
              </button>
              {subcategories.map((sub) => {
                const Icon = subcategoryIcons[sub.key];
                return (
                  <button
                    key={sub.key}
                    className={`template-subcategory ${activeSubcategory === sub.key ? "active" : ""}`}
                    onClick={() =>
                      setActiveSubcategory(
                        activeSubcategory === sub.key ? null : sub.key
                      )
                    }
                    data-id={`template-panel--filter--${sub.key}`}
                  >
                    {Icon && <Icon size={12} />}
                    {sub.label}
                  </button>
                );
              })}
            </div>
            <div className="template-grid">
              {filteredSections.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onInsert={() => handleInsertSection(template)}
                />
              ))}
              {filteredSections.length === 0 && (
                <div className="template-empty">No templates found</div>
              )}
            </div>
          </>
      </div>
    </div>
  );
};

const TemplateCard = ({ template, onInsert }) => {
  const Icon = subcategoryIcons[template.subcategory] || LayoutTemplate;
  return (
    <div
      className="template-card"
      data-id={`template-panel--card--${template.id}`}
    >
      <div
        className="template-card-preview"
        style={{ backgroundColor: getPreviewColor(template.subcategory) }}
      >
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <div className="template-card-info">
        <div className="template-card-name">{template.name}</div>
        <div className="template-card-desc">{template.description}</div>
      </div>
      <button
        className="template-card-insert"
        onClick={onInsert}
        data-id={`template-panel--button--insert-${template.id}`}
      >
        Insert
      </button>
    </div>
  );
};

function getPreviewColor(subcategory) {
  const colors = {
    promo: "#fde8e8",
    hero: "#e8d5f5",
    trust: "#e8f0e8",
    product: "#f5e8f0",
    features: "#d5e8f5",
    testimonials: "#f5e8d5",
    gallery: "#e8e0f5",
    cta: "#d5f5e8",
    pricing: "#f5d5d5",
    content: "#e8f5d5",
    footer: "#d5d5f5",
    faq: "#f5f5d5",
  };
  return colors[subcategory] || "#e8e8e8";
}

export default TemplatePanel;
